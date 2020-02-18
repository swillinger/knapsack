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
import { useValueDebounce, KsSelect, Icon } from '@knapsack/design-system';
import arrayMove from 'array-move';
import produce from 'immer';
import shortid from 'shortid';
import knapsackSlices from './slices';
import CustomSlice from './custom-slice';
import { KnapsackCustomPageSlice } from '../../../schemas/custom-pages';
import { useSelector } from '../../store';
import './custom-slice-collection.scss';

const AddSliceForm = ({
  addSlice,
  index,
}: {
  addSlice: (index: number, sliceId: string) => void;
  index: number;
}) => (
  <KsSelect
    options={[
      { label: '(Select type)', value: '' },
      ...knapsackSlices.map(slice => ({
        label: slice.title || slice.id,
        value: slice.id,
      })),
    ]}
    isLabelInline
    label={<Icon symbol="add" />}
    handleChange={({ value: sliceId }) => {
      if (sliceId) addSlice(index, sliceId);
    }}
  />
);

type Props = {
  initialSlices?: KnapsackCustomPageSlice[];
  handleSave: (slices: KnapsackCustomPageSlice[]) => void;
};

export const CustomSliceCollection: React.FC<Props> = ({
  initialSlices = [],
  handleSave,
}: Props) => {
  const { canEdit } = useSelector(s => s.userState);
  const [slices, setSlices] = useValueDebounce(initialSlices, handleSave);

  const setSliceData = (
    index: number,
    data: KnapsackCustomPageSlice['data'],
  ): void => {
    setSlices(prevSlices =>
      prevSlices.map((slice, i) => {
        if (i !== index) return slice;
        return {
          ...slice,
          data,
        };
      }),
    );
  };

  const addSlice = (index: number, sliceId: string): void => {
    const slice = knapsackSlices.find(b => b.id === sliceId);
    setSlices(prevSlices => {
      return produce(prevSlices, draft => {
        draft.splice(index, 0, {
          id: shortid.generate(),
          blockId: sliceId,
          data: slice.initialData,
        });
      });
    });
  };

  const deleteSlice = (index: number): void => {
    setSlices(prevSlices => prevSlices.filter((slice, i) => i !== index));
  };

  const moveSlice = (from: number, to: number): void => {
    setSlices(prevSlices => arrayMove(prevSlices, from, to));
  };

  const moveSliceUp = (index: number): void => moveSlice(index, index - 1);
  const moveSliceDown = (index: number): void => moveSlice(index, index + 1);

  return (
    <section className="ks-custom-slice-collection">
      {slices.map((slice, sliceIndex) => (
        <div key={slice.id}>
          {canEdit && (
            <div className="ks-custom-slice-collection__add-slice">
              <AddSliceForm addSlice={addSlice} index={sliceIndex} />
            </div>
          )}
          <CustomSlice
            key={slice.id}
            slice={slice}
            sliceIndex={sliceIndex}
            slicesLength={slices.length}
            canEdit={canEdit}
            setSliceData={setSliceData}
            moveSlice={moveSlice}
            deleteSlice={deleteSlice}
            moveSliceUp={moveSliceUp}
            moveSliceDown={moveSliceDown}
          />
        </div>
      ))}
      {canEdit && (
        <div className="ks-custom-slice-collection__add-slice">
          <AddSliceForm addSlice={addSlice} index={slices.length} />
        </div>
      )}
    </section>
  );
};
