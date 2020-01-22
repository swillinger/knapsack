import React from 'react';
import { Formik, Form, Field } from 'formik';
import { KsButton, TextInputWrapper } from '@knapsack/design-system';
import { saveToServer, useDispatch, useSelector } from '../client/store';

interface FormValues {
  title?: string;
  message?: string;
}

const ProposeChangePage: React.FC = () => {
  const dispatch = useDispatch();
  const canEdit = useSelector(s => s.userState.canEdit);

  const initialValues: FormValues = {
    title: 'Some new changes',
    message: '',
  };

  if (!canEdit) {
    return <h3>Sorry, you do not have permissions to edit</h3>;
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={({ title, message }, actions) => {
        dispatch(
          saveToServer({
            storageLocation: 'cloud',
            title,
            message,
          }),
        );
        actions.setSubmitting(false);
        actions.resetForm({});
      }}
    >
      {() => (
        <Form>
          <Field name="title">
            {({ field, form, meta }) => (
              <TextInputWrapper>
                <>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label className="ks-field-label" htmlFor="title">
                    Title
                  </label>
                  <input id="title" type="text" {...field} />
                  {meta.touched && meta.error && (
                    <div className="ks-error">{meta.error}</div>
                  )}
                </>
              </TextInputWrapper>
            )}
          </Field>
          <br />
          <Field name="message">
            {({ field, form, meta }) => (
              <TextInputWrapper>
                <>
                  <label className="ks-field-label" htmlFor="message">
                    Message
                    <textarea id="message" type="text" {...field} />
                  </label>
                  {meta.touched && meta.error && (
                    <div className="ks-error">{meta.error}</div>
                  )}
                </>
              </TextInputWrapper>
            )}
          </Field>
          <br />
          <KsButton kind="primary" type="submit">
            Propose Change
          </KsButton>
        </Form>
      )}
    </Formik>
  );
};

export default ProposeChangePage;
