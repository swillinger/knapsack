import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames'; // https://www.npmjs.com/package/classnames
import './add-entity.scss';
import { Formik, Form, Field } from 'formik';
import { KsButton, KsTextField } from '@knapsack/design-system';

type Props = {
  /**
   * Give it a dark color scheme?
   */
  isDark?: boolean;
  handleAdd: (values: MyFormValues) => void;
};

interface MyFormValues {
  title: string;
  entityType?: string;
}

function useOutsideAlert(ref, setIsShowing, isShowing) {
  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsShowing(!isShowing);
    }
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
}

export const AddEntity: React.FC<Props> = ({
  handleAdd,
  isDark = false,
}: Props) => {
  const initialValues: MyFormValues = {
    title: '',
    entityType: 'pattern',
  };

  const [isShowing, setIsShowing] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlert(wrapperRef, setIsShowing, isShowing);

  const classes = cn({
    'ks-add-entity': true,
    'ks-add-entity--is-dark': isDark,
    'ks-add-entity--active': isShowing,
  });

  /* eslint-disable jsx-a11y/label-has-associated-control */

  return (
    <div className={classes} ref={isShowing ? wrapperRef : null}>
      <div className="ks-add-entity__popup">
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            handleAdd(values);
            actions.setSubmitting(false);
            setIsShowing(!isShowing);
            actions.setFieldValue('title', '');
          }}
        >
          {() => (
            <Form>
              <div className="ks-radio-group">
                {/* @TODO: Remove opacity style once this is no longer disabled */}
                <label htmlFor="pattern">
                  <Field
                    name="entityType"
                    type="radio"
                    value="pattern"
                    id="pattern"
                  />
                  Pattern
                </label>
                <span className="ks-radio-group__subtitle">
                  A new UI pattern (e.g. button, hero, tabs). This content type
                  will create the groundwork for defining and developing a new
                  component for your design system.
                </span>
                <label htmlFor="page">
                  <Field
                    name="entityType"
                    type="radio"
                    value="page"
                    id="page"
                  />
                  Page
                </label>
                <span className="ks-radio-group__subtitle">
                  A new blank page where text content and documentation slices
                  can be combined to document anything (e.g. “Getting Started”).
                </span>
                <label htmlFor="group">
                  <Field
                    name="entityType"
                    type="radio"
                    value="group"
                    id="group"
                  />
                  Group
                </label>
                <span className="ks-radio-group__subtitle">
                  A new empty group, used for organizing patterns and pages in
                  the left navigation.
                </span>
              </div>
              <div className="ks-add-entity__footer">
                <Field name="title">
                  {({ field, form, meta }) => (
                    <div className="ks-add-entity__footer__title-field">
                      <KsTextField
                        label="Title"
                        inputProps={{
                          ...field,
                          autoComplete: 'off',
                        }}
                        error={meta.error}
                        flush
                      />
                    </div>
                  )}
                </Field>
                <KsButton
                  kind="primary"
                  type="submit"
                  // @TODO: Wire up this button.
                  // onClick={() => {}}
                >
                  Add
                </KsButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <KsButton
        kind="icon-standard"
        icon="add"
        handleTrigger={() => setIsShowing(!isShowing)}
      >
        Add Navigation Element
      </KsButton>
    </div>
  );
};
