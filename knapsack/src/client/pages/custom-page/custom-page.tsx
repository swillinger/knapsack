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
import { useDispatch } from 'react-redux';
import { updateCustomPage, useSelector } from '../../store';
import PageWithSidebar from '../../layouts/page-with-sidebar';
import { KnapsackCustomPageSlice } from '../../../schemas/custom-pages';
import { CustomSliceCollection } from './custom-slice-collection';

type Props = {
  pageId: string;
};

const CustomPage: React.FC<Props> = ({ pageId }: Props) => {
  const page = useSelector(
    ({ customPagesState }) => customPagesState.pages[pageId],
  );
  if (!page) {
    throw new Error(`The page id "${pageId}" was not found`);
  }

  const initialSlices = page.slices || [];
  const dispatch = useDispatch();

  return (
    <PageWithSidebar title={page.title}>
      <CustomSliceCollection
        initialSlices={initialSlices}
        handleSave={slices => {
          dispatch(
            updateCustomPage({
              slices,
              id: pageId,
              title: page.title,
            }),
          );
        }}
      />
    </PageWithSidebar>
  );
};

export default CustomPage;
