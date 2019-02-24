/**
 *  Copyright (C) 2018 Basalt
    This file is part of Bedrock.
    Bedrock is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Bedrock is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Bedrock; if not, see <https://www.gnu.org/licenses>.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@basalt/bedrock-atoms';
import { PlaygroundStyledSchemaForm } from './page-builder.styles';

const PageBuilderEditForm = ({
  schema,
  data,
  handleChange,
  handleError,
  handleHideEditForm,
  handleClearData,
  uiSchema,
}) => (
  <div>
    <h4>Edit</h4>
    {schema && (
      <PlaygroundStyledSchemaForm
        schema={schema}
        uiSchema={uiSchema}
        formData={data}
        onChange={handleChange}
        onError={handleError}
        onSubmit={() =>
          console.log(
            'Playground Edit Form was submitted, but it is not wired up to anything....',
          )
        }
        debug
      />
    )}
    <Button
      onClick={handleHideEditForm}
      onKeyPress={handleHideEditForm}
      type="submit"
      tabIndex="0"
      className="button button--color-blue button--size-small"
      primary
    >
      Done
    </Button>
    <Button
      style={{ marginLeft: '1rem' }}
      onClick={handleClearData}
      onKeyPress={handleClearData}
      type="submit"
      tabIndex="0"
      className="button button--color-iron button--size-small"
    >
      Clear
    </Button>
  </div>
);

PageBuilderEditForm.defaultProps = {
  data: {},
};

PageBuilderEditForm.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  data: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  handleHideEditForm: PropTypes.func.isRequired,
  handleClearData: PropTypes.func.isRequired,
};

export default PageBuilderEditForm;
