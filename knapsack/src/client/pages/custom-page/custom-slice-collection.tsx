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
import { Button, SchemaForm } from '@knapsack/design-system';
import arrayMove from 'array-move';
import shortid from 'shortid';
import knapsackSlices from './slices';
import CustomSlice from './custom-slice';
import { KnapsackCustomPageSlice } from '../../../schemas/custom-pages';

const AddSliceForm = ({
  addSlice,
  index,
}: {
  addSlice: (index: number, sliceId: string) => void;
  index: number;
}) => (
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

type Props = {
  userCanSave: boolean;
  initialSlices?: KnapsackCustomPageSlice[];
  handleSave: (slices: KnapsackCustomPageSlice[]) => void;
};

type State = {
  saveButtonText: string;
  isEditing: boolean;
  slices: KnapsackCustomPageSlice[];
};

export class CustomSliceCollection extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      slices: props.initialSlices || [],
      saveButtonText: 'Save',
      isEditing: false,
    };

    this.moveSliceDown = this.moveSliceDown.bind(this);
    this.moveSliceUp = this.moveSliceUp.bind(this);
    this.deleteSlice = this.deleteSlice.bind(this);
    this.setSliceData = this.setSliceData.bind(this);
    this.addSlice = this.addSlice.bind(this);
  }

  setSliceData(index: number, data: KnapsackCustomPageSlice['data']): void {
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

  addSlice(index: number, sliceId: string): void {
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
   * @param index - Index of item in `this.state.slices` to move up
   * @return sets state
   */
  moveSliceUp(index: number): void {
    this.setState(prevState => ({
      slices: arrayMove(prevState.slices, index, index - 1),
    }));
  }

  /**
   * @param index - Index of item in `this.state.slices` to move down
   * @return sets state
   */
  moveSliceDown(index: number): void {
    this.setState(prevState => ({
      slices: arrayMove(prevState.slices, index, index + 1),
    }));
  }

  /**
   * @param sliceId
   * @return sets state
   */
  deleteSlice(sliceId: string): void {
    this.setState(prevState => ({
      slices: prevState.slices.filter(slice => slice.id !== sliceId),
    }));
  }

  render() {
    const { userCanSave, handleSave } = this.props;

    const { slices = [], isEditing, saveButtonText } = this.state;
    return (
      <section className="ks-ks-custom-slice-collection">
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {userCanSave && (
            <div style={{ marginRight: '.5rem' }}>
              <Button
                onClick={() =>
                  this.setState(prevState => ({
                    isEditing: !prevState.isEditing,
                  }))
                }
              >
                Toggle Edit Mode
              </Button>
              <Button
                onClick={() => {
                  this.setState({ saveButtonText: 'Saving...' });
                  setTimeout(() => {
                    this.setState({ saveButtonText: 'Save' });
                  }, 500);
                  handleSave(slices);
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
      </section>
    );
  }
}
