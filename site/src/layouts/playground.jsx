import React, { Component } from 'react';
import PropTypes from 'prop-types';
import arrayMove from 'array-move';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import uuid from 'uuid/v4';
import Spinner from '@basalt/bedrock-spinner';
import Slice from '../components/slice';
import PlaygroundEditForm from '../components/playground-edit-form';
import Sidebar from '../components/sidebar';
import { apiUrlBase } from '../../config';

const MainContent = styled.div`
  flex-grow: 1;
  padding: var(--spacing-l);
`;

const Page = styled.div`
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 229px);
  width: 100%;
  max-width: 100vw;
  // @todo fix this temp workaround for negatting the "MainContent" padding
  margin: calc(-1 * var(--spacing-l));
`;

class Playground extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      example: {},
      slices: [],
      showEditForm: false,
      editForm: {
        sliceIndexCurrentlyBeingEdited: null,
        schema: {},
        data: {},
        uiSchema: {},
        handleSubmit: () => {},
        handleChange: () => {},
        handleError: () => {},
      },
    };
    this.showEditForm = this.showEditForm.bind(this);
    this.moveSliceUp = this.moveSliceUp.bind(this);
    this.moveSliceDown = this.moveSliceDown.bind(this);
    this.deleteSlice = this.deleteSlice.bind(this);
    this.addSlice = this.addSlice.bind(this);
    this.hideEditForm = this.hideEditForm.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    window
      .fetch(`${apiUrlBase}/example/${this.props.id}`)
      .then(res => res.json())
      .then(example => {
        this.setState({
          example,
          slices: example.slices,
          ready: true,
        });
      });
  }

  save() {
    const newExample = Object.assign({}, this.state.example, {
      slices: this.state.slices,
    });

    window
      .fetch(`${apiUrlBase}/example/${this.props.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExample),
      })
      .then(res => res.json())
      .then(results => {
        console.log('Save Results:', results);
      });
  }

  /**
   * @param {Object} editForm - Options
   * @param {Object} editForm.data - Current data to pass to Pattern
   * @param {Object} editForm.uiSchema - Schema Form Ui Schema @todo not used currently
   * @param {Object} editForm.schema - Schema of Pattern
   * @param {Function} editForm.handleSubmit - Handle Schema Form submit
   * @param {Function} editForm.handleChange - Handle Schema Form change
   * @param {Function} editForm.handleError - Handle Schema Form error
   * @param {number} editForm.contentBlockIndexCurrentlyBeingEdited - Which Slice
   * @return {null} - sets state
   */
  showEditForm(editForm) {
    this.setState({
      showEditForm: true,
      editForm,
    });
  }

  hideEditForm() {
    this.setState({ showEditForm: false });
  }

  /**
   * @param {number} index - Index of item in `this.state.slices` to move up
   * @return {null} - sets state
   */
  moveSliceUp(index) {
    this.setState(prevState => ({
      slices: arrayMove(prevState.slices, index, index - 1),
    }));
  }

  /**
   * @param {number} index - Index of item in `this.state.slices` to move down
   * @return {null} - sets state
   */
  moveSliceDown(index) {
    this.setState(prevState => ({
      slices: arrayMove(prevState.slices, index, index + 1),
    }));
  }

  deleteSlice(sliceId) {
    this.setState(prevState => ({
      slices: prevState.slices.filter(slice => slice.id !== sliceId),
    }));
  }

  addSlice(slice) {
    // @todo pick where in `slices` one can add
    this.setState(prevState => ({
      slices: [slice, ...prevState.slices],
    }));
  }

  render() {
    const sidebarContents = this.state.showEditForm ? (
      <PlaygroundEditForm
        schema={this.state.editForm.schema}
        data={this.state.editForm.data}
        handleChange={data => {
          console.info(
            `@todo Update data in 'this.state.slices' for this item with this data `,
            data.formData,
          );
          this.state.editForm.handleChange(data);
        }}
        handleSubmit={this.state.editForm.handleSubmit}
        handleError={this.state.editForm.handleError}
        hideEditForm={this.hideEditForm}
      />
    ) : (
      <div>
        <h4>Patterns</h4>
        <ul>
          {this.props.patterns
            .filter(pattern => pattern.id !== 'site-footer')
            .filter(pattern => pattern.id !== 'site-header')
            .map(pattern => (
              <li key={pattern.id}>
                <h5 style={{ marginBottom: '0' }}>{pattern.title}</h5>
                <img
                  src={`/assets/images/pattern-thumbnails/${pattern.id}.svg`}
                  alt={pattern.title}
                />
                <button
                  type="button"
                  tabIndex="0"
                  onKeyPress={() =>
                    this.addSlice({
                      id: uuid(),
                      patternId: pattern.id,
                      data: {},
                    })
                  }
                  onClick={() =>
                    this.addSlice({
                      id: uuid(),
                      patternId: pattern.id,
                      data: {},
                    })
                  }
                >
                  Add {pattern.title}
                </button>
                <br />
                <Link to={`/patterns/components/${pattern.id}`}>
                  View Details
                </Link>
              </li>
            ))}
        </ul>
      </div>
    );

    if (!this.state.ready) {
      return <Spinner />;
    }

    return (
      <Page>
        <Sidebar>
          <button type="submit" onKeyPress={this.save} onClick={this.save}>
            Save Everything (not fully functioning)
          </button>
          {sidebarContents}
        </Sidebar>
        <MainContent>
          <h1>{this.state.example.title}</h1>
          <h2>Playground for id: {this.props.id}</h2>
          {this.state.slices.map((slice, sliceIndex) => {
            const pattern = this.props.patterns.find(
              p => p.id === slice.patternId,
            );
            const template = pattern.templates[0];
            return (
              <Slice
                key={slice.id}
                template={template.name}
                schema={template.schema}
                data={slice.data}
                showEditForm={this.showEditForm}
                sliceIndex={sliceIndex}
                totalSlicesLength={this.state.slices.length}
                deleteMe={() => this.deleteSlice(slice.id)}
                moveUp={() => this.moveSliceUp(sliceIndex)}
                moveDown={() => this.moveSliceDown(sliceIndex)}
                isBeingEdited={
                  this.state.editForm.sliceIndexCurrentlyBeingEdited ===
                  sliceIndex
                }
                // handleSubmit={data =>
                //   this.handleSave(blockId, data, moduleName, packageVersion)
                // }
              />
            );
          })}
        </MainContent>
      </Page>
    );
  }
}

Playground.propTypes = {
  patterns: PropTypes.array.isRequired, // eslint-disable-line
  example: PropTypes.object.isRequired, // eslint-disable-line
  id: PropTypes.string.isRequired, // @todo save/show playgrounds based on `id`
};

export default Playground;