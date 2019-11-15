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
import { SchemaForm } from '@knapsack/design-system';
import {
  useSelector,
  useDispatch,
  setStatus,
  updateCustomSections,
} from '../../store';
import schema from '../../../json-schemas/schemaKnapsackCustomPageSettingsForm';

export const CustomPagesSettings: React.FC = () => {
  const sections = useSelector(store => store.customPagesState.sections);
  const dispatch = useDispatch();

  return (
    <SchemaForm
      schema={schema}
      formData={{ sections }}
      onSubmit={({ formData }) => {
        dispatch(updateCustomSections(formData.sections as typeof sections));
        dispatch(
          setStatus({
            type: 'success',
            message: 'Settings updated',
            dismissAfter: 2,
          }),
        );
      }}
      hasSubmit
      uiSchema={{
        sections: {
          'ui:detailsOpen': true,
          items: {
            classNames: 'rjsf-custom-object-grid-3',
            'ui:help':
              'Page will get url in form of "/SECTION_ID/PAGE_ID". It is your responsibility to ensure it is unique and does not conflict with any other page.',
            id: {
              'ui:help': 'Must be lowercase with hyphens and no spaces',
            },
            pages: {
              'ui:detailsOpen': true,
              items: {
                classNames: 'rjsf-custom-object-grid-2',
                id: {
                  'ui:help': 'Must be lowercase with hyphens and no spaces',
                },
              },
            },
          },
        },
      }}
    />
  );
};
