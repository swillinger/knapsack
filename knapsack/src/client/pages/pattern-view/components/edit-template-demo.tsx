import React, { useState } from 'react';
import { KsButton, SchemaForm } from '@knapsack/design-system';
import cn from 'classnames';
import { JsonSchemaObject } from '@knapsack/core/src/types';
import { useSelector } from '../../../store';
import { files } from '../../../data';
import * as Files from '../../../../schemas/api/files';
import './edit-template-demo.scss';

type Props = {
  maxWidth?: number;
  handleSubmit: (data: { path: string; alias: string }) => void;
  data?: {
    path: string;
    alias: string;
  };
};

export const EditTemplateDemo: React.FC<Props> = ({
  handleSubmit,
  maxWidth,
  data: initialData,
}: Props) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<{ msg: string }[]>([]);
  const currentTemplateRendererId = useSelector(
    s => s.ui.currentTemplateRenderer,
  );
  const currentTemplateRenderer = useSelector(
    s => s.patternsState.renderers[currentTemplateRendererId],
  );

  if (!currentTemplateRenderer) return null;

  const {
    title,
    aliasUse,
    aliasDescription,
    aliasTitle = 'Alias',
    iconSvg,
  } = currentTemplateRenderer?.meta;

  const classes = cn({
    'ks-edit-template-demo': true,
  });

  const schema: JsonSchemaObject = {
    type: 'object',
    required: ['path'],
    properties: {
      path: {
        type: 'string',
        title: 'Path',
        description:
          'The file path to the template can be a full absolute path, a relative path from the data directory, or a string that `require.resolve()` can handle.',
      },
    },
  };

  if (aliasUse !== 'off') {
    schema.properties.alias = {
      type: 'string',
      title: aliasTitle,
      description: aliasDescription,
    };
    if (aliasUse === 'required') {
      schema.required.push('alias');
    }
  }

  return (
    <div
      className={classes}
      style={{ maxWidth: maxWidth ? `${maxWidth}px` : '100%' }}
    >
      <div className="ks-edit-template-demo__content">
        <h5 className="ks-edit-template-demo__title">
          {title} Template
          <span
            className="ks-edit-template-demo__logo"
            dangerouslySetInnerHTML={{ __html: iconSvg }}
          />
        </h5>
        <p className="ks-edit-template-demo__intro ks-u-body-small">
          A template demo references is a reference to a pre-coded file, rather
          than being built via the schema data editor.
        </p>

        {errors.length > 0 && (
          <div className="ks-rjsf">
            <div className="panel panel-danger">
              <h3 className="panel-title">Errors</h3>
              <ul>
                {errors.map(error => (
                  <li key={error.msg} className="text-danger">
                    {error.msg}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <SchemaForm
          formData={data}
          schema={schema}
          hasSubmit
          onChange={event => {
            setData(event.formData);
          }}
          liveValidate={false}
          validate={(formData, formErrors) => {
            // if (data.path === 'f') {
            //   formErrors.path.addError('cannot start with f');
            //   formErrors.path.addError('cannot start with f!!');
            // }
            return formErrors;
          }}
          submitText={initialData?.path ? 'Update' : 'Add'}
          showErrorList
          onSubmit={x => {
            const { path, alias } = x.formData;
            setErrors([]);

            files({
              type: Files.ACTIONS.verify,
              payload: {
                path,
                alias,
              },
            }).then(result => {
              if (result.type === Files.ACTIONS.verify) {
                const { path: xpath, exists } = result.payload;
                if (exists) {
                  handleSubmit({
                    path: xpath,
                    alias,
                  });
                } else {
                  setErrors([
                    {
                      msg: `Path: does not exist. Please create the file first.`,
                    },
                  ]);
                  console.error('does not exist!');
                }
              }
            });
          }}
        >
          <KsButton type="submit">Add</KsButton>
        </SchemaForm>
      </div>
    </div>
  );
};
