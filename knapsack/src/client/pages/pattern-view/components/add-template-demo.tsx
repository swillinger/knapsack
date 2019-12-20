import React, { useState } from 'react';
import cn from 'classnames';
import './add-template-demo.scss';
import { KsButton, KsPopover, SchemaForm } from '@knapsack/design-system';

type Props = {};

// eslint-disable-next-line no-empty-pattern
export const AddTemplateDemo: React.FC<Props> = ({}: Props) => {
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen(c => !c);

  const content = (
    <div className="ks-add-template-demo__content">
      <p className="ks-add-template-demo__intro u-body-small">
        A template demo references is a reference to a pre-coded file, rather
        than being built via the schema data editor.
      </p>

      <SchemaForm
        schema={{
          type: 'object',
          properties: {
            path: {
              type: 'string',
              title: 'Path',
            },
            alias: {
              type: 'string',
              title: 'Alias',
              description: 'details here',
            },
          },
        }}
        hasSubmit
        submitText="Add (not hooked up)"
        onSubmit={x => {
          console.log('schema form submit', x);
        }}
      >
        <KsButton type="submit">Add</KsButton>
      </SchemaForm>
    </div>
  );

  const classes = cn({
    'ks-add-template-demo': true,
  });
  return (
    <div className={classes}>
      <KsPopover isOpen={isOpen} content={content}>
        <KsButton
          kind="standard"
          icon="add"
          size="s"
          handleTrigger={toggleOpen}
        >
          Template Demo
        </KsButton>
      </KsPopover>
    </div>
  );
};
