import React from 'react';
import PT from 'prop-types';
import Form from 'react-jsonschema-form';
import uuid from 'uuid/v4';
import { Button } from '@basalt/bedrock-atoms';
import './schema-form.css';
import ObjectFieldTemplate from './custom-templates/custom-object';
import CustomArrayField from './custom-templates/array-field';
import CustomField from './custom-templates/custom-field';
import CheckboxWidget from './custom-templates/checkbox-widget';
import CheckboxesWidget from './custom-templates/checkboxes-widget';

/* eslint-disable no-console */
export default class SchemaForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onError = this.onError.bind(this);
  }

  onChange(data) {
    if (this.props.isDebug) {
      console.log('Form Data changed ', data);
    }
    this.props.onChange(data);
  }

  onSubmit(data) {
    if (this.props.isDebug) {
      console.log('Form Data submitted ', data);
    }
    this.props.onSubmit(data);
  }

  onError(data) {
    if (this.props.isDebug) {
      console.log('Form Data error ', data);
    }
    this.props.onError(data);
  }

  render() {
    return (
      <div className={this.props.className}>
        <Form
          {...this.props}
          formData={this.props.formData}
          schema={this.props.schema}
          uiSchema={this.props.uiSchema ? this.props.uiSchema : undefined}
          onSubmit={this.onSubmit}
          onError={this.onError}
          onChange={this.onChange}
          ObjectFieldTemplate={ObjectFieldTemplate}
          ArrayFieldTemplate={CustomArrayField}
          FieldTemplate={CustomField}
          className={this.props.isInline ? 'rjsf rjsf--inline' : 'rjsf'}
          widgets={{
            // can add any of our own OR replace any of these core ones: https://github.com/mozilla-services/react-jsonschema-form/tree/master/src/components/widgets
            CheckboxWidget,
            CheckboxesWidget,
          }}
        >
          {!this.props.hasSubmit && <span />}
          {this.props.hasSubmit && <Button primary>Submit</Button>}
        </Form>
      </div>
    );
  }
}

SchemaForm.defaultProps = {
  idPrefix: `schema-form--${uuid()}`,
  isDebug: false,
  uiSchema: {},
  isInline: false,
  formData: {},
  onChange: () => {},
  onSubmit: () => {},
  onError: () => {},
  hasSubmit: false,
  className: '',
};

SchemaForm.propTypes = {
  schema: PT.object.isRequired, // eslint-disable-line react/forbid-prop-types
  uiSchema: PT.object, // eslint-disable-line react/forbid-prop-types
  onChange: PT.func,
  onError: PT.func,
  onSubmit: PT.func,
  isDebug: PT.bool,
  idPrefix: PT.string,
  isInline: PT.bool, // @todo implement `isInline` form for left-to-right mini-forms
  formData: PT.object,
  hasSubmit: PT.bool,
  className: PT.string,
};
