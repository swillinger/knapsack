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
  path: string;
  title: string;
  sectionTitle: string;
  sectionId: string;
  pageId: string;
  userCanSave: boolean;
  initialSlices?: KnapsackCustomPageSlice[];
};

const CustomPage: React.FC<Props> = ({ path, title, sectionTitle }: Props) => {
  const userCanSave = useSelector(state =>
    state.userState.role.permissions.includes('write'),
  );
  const initialSlices = useSelector(state => {
    const { pages } = state.customPagesState;
    if (!pages) return [];
    const page = pages.find(p => p.path === path);
    if (!page) return [];
    // @todo what happens if it's not found?
    return page.slices;
  });
  const dispatch = useDispatch();

  return (
    <PageWithSidebar section={sectionTitle} title={title}>
      <CustomSliceCollection
        userCanSave={userCanSave}
        initialSlices={initialSlices}
        handleSave={slices => {
          dispatch(
            updateCustomPage({
              slices,
              path,
            }),
          );
        }}
      />
    </PageWithSidebar>
  );
};

export default CustomPage;
