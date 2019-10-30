/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Button, SchemaForm, Spinner } from '@knapsack/design-system';
import arrayMove from 'array-move';
import shortid from 'shortid';
import { KnapsackContext } from '../../context';
import knapsackSlices from './slices';
import { gqlQuery } from '../../data';
import CustomSlice from './custom-slice';
import PageWithSidebar from '../../layouts/page-with-sidebar';

const query = gql`
  query CustomSlicesPage($path: ID!) {
    customPage(path: $path) {
      path
      slices {
        id
        blockId
        data
      }
    }
  }
`;

const saveQuery = gql`
  mutation setCustomPage($path: ID, $data: JSON) {
    setCustomPage(path: $path, customPage: $data) {
      path
    }
  }
`;

const AddSliceForm = ({ addSlice, index }) => (
  <SchemaForm
    schema={{
      type: 'object',
      $schema: 'http://json-schema.org/draft-07/schema',
      properties: {
        slice: {
          title: 'Add Slice',
          type: 'string',
          enum: knapsackSlices.map(b => b.id),
          enumNames: knapsackSlices.map(b => b.title || b.id),
        },
      },
    }}
    onChange={({ formData }) => {
      if (!formData.slice) return;
      addSlice(index, formData.slice);
    }}
  />
);

AddSliceForm.propTypes = {
  addSlice: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

class CustomPage extends React.Component {
  static contextType = KnapsackContext;

  constructor(props) {
    super(props);
    this.state = {
      slices: [],
      saveButtonText: 'Save',
      isEditing: false,
      ready: false,
    };

    this.moveSliceDown = this.moveSliceDown.bind(this);
    this.moveSliceUp = this.moveSliceUp.bind(this);
    this.deleteSlice = this.deleteSlice.bind(this);
    this.setSliceData = this.setSliceData.bind(this);
    this.addSlice = this.addSlice.bind(this);
  }

  componentDidMount() {
    gqlQuery({
      gqlQueryObj: query,
      variables: { path: this.props.path },
    })
      .then(({ data }) => {
        // console.log({data});
        const {
          customPage: { slices },
        } = data;
        this.setState({
          ready: true,
          slices: slices || [],
        });
      })
      .catch(console.log.bind(console));
  }

  /**
   * @param {number} index
   * @param {object} data
   * @return {void}
   */
  setSliceData(index, data) {
    this.setState(prevState => {
      const oldSlice = prevState.slices[index];
      prevState.slices.splice(index, 1, {
        ...oldSlice,
        data,
      });
      return {
        slices: prevState.slices,
      };
    });
  }

  /**
   * @param {number} index
   * @param {string} sliceId
   * @return {void} - sets state
   */
  addSlice(index, sliceId) {
    const slice = knapsackSlices.find(b => b.id === sliceId);
    this.setState(prevState => {
      prevState.slices.splice(index, 0, {
        id: shortid.generate(),
        blockId: sliceId,
        data: slice.initialData,
      });
      return {
        slices: prevState.slices,
      };
    });
  }

  /**
   * @param {number} index - Index of item in `this.state.slices` to move up
   * @return {void} - sets state
   */
  moveSliceUp(index) {
    this.setState(prevState => ({
      slices: arrayMove(prevState.slices, index, index - 1),
    }));
  }

  /**
   * @param {number} index - Index of item in `this.state.slices` to move down
   * @return {void} - sets state
   */
  moveSliceDown(index) {
    this.setState(prevState => ({
      slices: arrayMove(prevState.slices, index, index + 1),
    }));
  }

  /**
   * @param {string} sliceId
   * @return {void} - sets state
   */
  deleteSlice(sliceId) {
    this.setState(prevState => ({
      slices: prevState.slices.filter(slice => slice.id !== sliceId),
    }));
  }

  render() {
    const { title, sectionTitle } = this.props;
    if (!this.state.ready) {
      return <Spinner />;
    }
    const { slices = [], isEditing, saveButtonText } = this.state;
    return (
      <PageWithSidebar {...this.props}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h4 className="eyebrow">{sectionTitle}</h4>
            <h3>{title}</h3>
          </div>
          {this.context.permissions.includes('write') && (
            <div>
              <Button
                onClick={() =>
                  this.setState(prevState => ({
                    isEditing: !prevState.isEditing,
                  }))
                }
                style={{ marginRight: '.5rem' }}
              >
                Toggle Edit Mode
              </Button>
              <Button
                onClick={() => {
                  this.setState({ saveButtonText: 'Saving...' });
                  gqlQuery({
                    gqlQueryObj: saveQuery,
                    variables: {
                      path: this.props.path,
                      data: {
                        slices: this.state.slices,
                      },
                    },
                  })
                    .then(() => {
                      setTimeout(() => {
                        this.setState({ saveButtonText: 'Save' });
                      }, 150); // Knapsack is too fast 🚀
                    })
                    .catch(error => {
                      // @todo improve error messaging using StatusMessage
                      console.error(error);
                      this.setState({ saveButtonText: 'Save Error!' });
                    });
                }}
              >
                {saveButtonText}
              </Button>
            </div>
          )}
        </header>

        {slices.map((slice, sliceIndex) => (
          <div key={slice.id}>
            {isEditing && (
              <AddSliceForm addSlice={this.addSlice} index={sliceIndex} />
            )}
            <CustomSlice
              key={slice.id}
              slice={slice}
              sliceIndex={sliceIndex}
              slicesLength={slices.length}
              isEditing={isEditing}
              setSliceData={this.setSliceData}
              deleteSlice={this.deleteSlice}
              moveSliceUp={this.moveSliceUp}
              moveSliceDown={this.moveSliceDown}
            />
          </div>
        ))}
        {isEditing && (
          <AddSliceForm addSlice={this.addSlice} index={slices.length} />
        )}
      </PageWithSidebar>
    );
  }
}

CustomPage.propTypes = {
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  sectionTitle: PropTypes.string.isRequired,
};

export default CustomPage;
