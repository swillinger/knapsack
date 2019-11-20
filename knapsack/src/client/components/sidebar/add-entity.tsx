import React, { useState } from 'react';
import cn from 'classnames'; // https://www.npmjs.com/package/classnames
import './add-entity.scss';
import { Formik, Form, Field } from 'formik';
import { Button, TextInputWrapper } from '@knapsack/design-system';
import { FaPlus } from 'react-icons/fa';

type Props = {
  /**
   * Icon to display
   */
  icon: string;
  /**
   * Give it a dark color scheme?
   */
  isDark?: boolean;
  handleAdd: (values: MyFormValues) => void;
};

interface MyFormValues {
  title: string;
  entityType?: 'pattern' | 'page' | 'group';
}

// @TODO add event listener to close popup if clicks elsewhere on the screen

export const AddEntity: React.FC<Props> = ({
  icon,
  handleAdd,
  isDark = false,
}: Props) => {
  const initialValues: MyFormValues = {
    title: '',
  };

  const [isShowing, setIsShowing] = useState(false);

  const classes = cn({
    'ks-add-entity': true,
    'ks-add-entity--is-dark': isDark,
    'ks-add-entity--active': isShowing,
  });

  return (
    <div className={classes}>
      <div className="ks-add-entity__popup">
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            handleAdd(values);
            actions.setSubmitting(false);
          }}
          render={() => (
            <Form>
              <Field className="ks-radio-group" as="radio" name="entityType">
                <label htmlFor="pattern">
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
                  <input type="radio" id="page" name="entityType" value="page" />
                  Page
                </label>
                <span className="ks-radio-group__subtitle">
                  A new blank page where text content and documentation slices
                  can be combined to document anything (e.g. “Getting Started”).
                </span>
                <label htmlFor="group">
                  <input type="radio" id="group" name="entityType" value="group" />
                  Group
                </label>
                <span className="ks-radio-group__subtitle">
                  A new empty group, used for organizing patterns and pages in
                  the left navigation.
                </span>
              </Field>
              <Field
                name="title"
                render={({ field, form, meta }) => (
                  <TextInputWrapper>
                    <>
                      <label className="ks-field-label" htmlFor="title">
                        Title
                        <input id="title" type="text" {...field} />
                      </label>
                      {meta.touched && meta.error && meta.error}
                    </>
                  </TextInputWrapper>
                )}
              />
              <Button kind="primary" type="submit" size="l">
                Submit
              </Button>
            </Form>
          )}
        />
      </div>
      {/* @todo replace with more permanent icon solution */}
      <span className="ks-add-entity__icon">
        <FaPlus onClick={() => setIsShowing(!isShowing)} />
      </span>
    </div>
  );
};
