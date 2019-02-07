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
import SchemaForm from '@basalt/bedrock-schema-form';
import Template from '../../components/template';
import {
  DemoGrid,
  DemoStage,
  Resizable,
  SchemaFormWrapper,
  SchemaFormWrapperInner,
} from './pattern-stage.styles';

class PatternStage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      prevProps: props,
      // html: '',
      // isStringTemplate: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      JSON.stringify(nextProps.data) !==
      JSON.stringify(prevState.prevProps.data)
    ) {
      return {
        data: nextProps.data,
        prevProps: nextProps,
      };
    }
    return null;
  }

  render() {
    const isSchemaFormShown =
      this.props.hasSchema && this.props.isSchemaFormShown;
    return (
      <>
        <DemoGrid size={this.props.demoSize}>
          <DemoStage size={this.props.demoSize}>
            <Resizable>
              <Template
                templateId={this.props.templateId}
                patternId={this.props.patternId}
                data={this.state.data}
                // handleNewHtml={html => this.setState({ html })}
                showDataUsed={false}
                // isStringTemplate={this.state.isStringTemplate}
              />
            </Resizable>
          </DemoStage>
          {isSchemaFormShown && (
            <SchemaFormWrapper size={this.props.demoSize}>
              <SchemaFormWrapperInner size={this.props.demoSize}>
                <h4>Edit Form</h4>
                <SchemaForm
                  schema={this.props.schema}
                  formData={this.state.data}
                  onChange={({ formData }) => {
                    this.props.handleNewData(formData);
                    this.setState({
                      data: formData,
                    });
                  }}
                  uiSchema={this.props.uiSchema}
                  isInline={this.props.isInline}
                />
              </SchemaFormWrapperInner>
            </SchemaFormWrapper>
          )}
        </DemoGrid>
        {/* <CodeBlockWrapper */}
        {/* style={{ display: this.state.fullScreen ? 'none' : 'block' }} */}
        {/* > */}
        {/* <h4>Live Code Snippets</h4> */}
        {/* <p> */}
        {/* The following code snippets will generate the component in the live */}
        {/* demo above. */}
        {/* </p> */}
        {/* <CodeBlock */}
        {/* items={[ */}
        {/* { */}
        {/* name: 'Twig', */}
        {/* code: twigCodeExample, */}
        {/* language: 'twig', */}
        {/* handleTyping: enableCodeBlockLiveEdit */}
        {/* ? text => { */}
        {/* this.setState({ */}
        {/* isStringTemplate: true, */}
        {/* template: text, */}
        {/* showForm: false, */}
        {/* }); */}
        {/* } */}
        {/* : null, */}
        {/* }, */}
        {/* { */}
        {/* name: 'HTML', */}
        {/* code: this.state.html, */}
        {/* language: 'html', */}
        {/* }, */}
        {/* { */}
        {/* name: 'JSON (Data Only)', */}
        {/* code: dataString, */}
        {/* language: 'json', */}
        {/* }, */}
        {/* ]} */}
        {/* /> */}
        {/* </CodeBlockWrapper> */}
      </>
    );
  }
}

PatternStage.defaultProps = {
  data: {},
  demoSize: 'l',
  uiSchema: {},
  isInline: false,
  isSchemaFormShown: false,
};

PatternStage.propTypes = {
  templateId: PropTypes.string.isRequired,
  patternId: PropTypes.string.isRequired,
  data: PropTypes.object,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  isInline: PropTypes.bool,
  isSchemaFormShown: PropTypes.bool,
  hasSchema: PropTypes.bool.isRequired,
  demoSize: PropTypes.string,
  handleNewData: PropTypes.func.isRequired,
};

export default PatternStage;
