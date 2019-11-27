import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames'; // https://www.npmjs.com/package/classnames
import './add-entity.scss';
import { Formik, Form, Field } from 'formik';
import { KsButton, KsTextField } from '@knapsack/design-system';
import { FaPlus } from 'react-icons/fa';

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
    entityType: null,
  };

  const [isShowing, setIsShowing] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlert(wrapperRef, setIsShowing, isShowing);

  const classes = cn({
    'ks-add-entity': true,
    'ks-add-entity--is-dark': isDark,
    'ks-add-entity--active': isShowing,
  });

  return (
    <div className={classes} ref={isShowing ? wrapperRef : null}>
      <div className="ks-add-entity__popup">
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            handleAdd(values);
            actions.setSubmitting(false);
            setIsShowing(!isShowing);
            actions.resetForm({});
          }}
        >
          {() => (
            <Form>
              <Field className="ks-radio-group" as="radio" name="entityType">
                {/* @TODO: Remove opacity style once this is no longer disabled */}
                <label htmlFor="pattern" style={{ opacity: 0.5 }}>
                  <input
                    type="radio"
                    id="pattern"
                    name="entityType"
                    value="pattern"
                    disabled
                  />
                  Pattern (coming soon)
                </label>
                <span className="ks-radio-group__subtitle">
                  A new UI pattern (e.g. button, hero, tabs). This content type
                  will create the groundwork for defining and developing a new
                  component for your design system.
                </span>
                <label htmlFor="page">
                  <input
                    type="radio"
                    id="page"
                    name="entityType"
                    value="page"
                  />
                  Page
                </label>
                <span className="ks-radio-group__subtitle">
                  A new blank page where text content and documentation slices
                  can be combined to document anything (e.g. “Getting Started”).
                </span>
                <label htmlFor="group">
                  <input
                    type="radio"
                    id="group"
                    name="entityType"
                    value="group"
                  />
                  Group
                </label>
                <span className="ks-radio-group__subtitle">
                  A new empty group, used for organizing patterns and pages in
                  the left navigation.
                </span>
              </Field>
              <div className="ks-add-entity__footer">
                <Field name="title">
                  {({ field, form, meta }) => (
                    <div className="ks-add-entity__footer__title-field">
                      <KsTextField
                        label="Title"
                        inputProps={field}
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
        onClick={() => setIsShowing(!isShowing)}
      >
        Add Navigation Element
      </KsButton>
    </div>
  );
};
