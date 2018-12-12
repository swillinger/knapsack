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
import { Link } from 'react-router-dom';
import SchemaForm from '@basalt/bedrock-schema-form';
import { Button, Select } from '@basalt/bedrock-atoms';
import CodeBlock from '@basalt/bedrock-code-block';
import { BedrockContext } from '@basalt/bedrock-core';
import Template from '../components/template';
import { enableCodeBlockLiveEdit } from '../../lib/features';
import {
  OverviewWrapper,
  CodeBlockWrapper,
  DemoGrid,
  DemoGridControls,
  DemoStage,
  FlexWrapper,
  Resizable,
  SchemaFormWrapper,
  SchemaFormWrapperInner,
} from './overview.styles';

const sizes = [
  {
    value: 's',
    title: 'Small',
  },
  {
    value: 'm',
    title: 'Medium',
  },
  {
    value: 'l',
    title: 'Large',
  },
  {
    value: 'full',
    title: 'Full',
  },
];

class Overview extends React.Component {
  static contextType = BedrockContext;

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      html: '',
      size: props.size,
      isStringTemplate: false,
      template: props.template,
      fullScreen: false,
      showForm: true,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ formData }) {
    this.setState({
      data: formData,
    });
  }

  render() {
    const dataString = JSON.stringify(this.state.data, null, '  ');
    const twigCodeExample = `
      {% include '${this.props.template}' with ${dataString} %}
    `;
    return (
      <OverviewWrapper {...this.props} {...this.state}>
        <FlexWrapper>
          <h4>Live Demo</h4>

          <DemoGridControls>
            <Select
              items={sizes}
              value={this.state.size}
              handleChange={size => this.setState({ size })}
              label="Stage Size"
            />
            <Button
              type="button"
              className="button button--size-small"
              onClick={() =>
                this.setState(prevState => ({
                  fullScreen: !prevState.fullScreen,
                }))
              }
            >
              {this.state.fullScreen ? 'Show Controls' : 'Fullscreen'}
            </Button>
            {this.context.permissions.includes('write') && (
              <Link to={`/patterns/${this.props.id}/edit`}>
                <Button>Edit Meta</Button>
              </Link>
            )}
          </DemoGridControls>
        </FlexWrapper>
        <DemoGrid size={this.state.size}>
          <DemoStage size={this.state.size}>
            <Resizable>
              <Template
                template={this.state.template}
                data={this.state.data}
                handleNewHtml={html => this.setState({ html })}
                showDataUsed={false}
                isStringTemplate={this.state.isStringTemplate}
              />
            </Resizable>
          </DemoStage>
          <SchemaFormWrapper
            size={this.state.size}
            showForm={this.state.showForm}
          >
            <SchemaFormWrapperInner size={this.state.size}>
              <h4>Edit Form</h4>
              <p>
                The following form is generated from the component schema
                (definition file). Edit this form to see your changes live.
                Changes will also update the code samples below.
              </p>
              <SchemaForm
                schema={this.props.schema}
                formData={this.state.data}
                onChange={this.handleChange}
                uiSchema={this.props.uiSchema}
                isInline={this.props.isInline}
              />
            </SchemaFormWrapperInner>
          </SchemaFormWrapper>
        </DemoGrid>
        <CodeBlockWrapper
          style={{ display: this.state.fullScreen ? 'none' : 'block' }}
        >
          <h4>Live Code Snippets</h4>
          <p>
            The following code snippets will generate the component in the live
            demo above.
          </p>
          <CodeBlock
            items={[
              {
                name: 'Twig',
                code: twigCodeExample,
                language: 'twig',
                handleTyping: enableCodeBlockLiveEdit
                  ? text => {
                      this.setState({
                        isStringTemplate: true,
                        template: text,
                        showForm: false,
                      });
                    }
                  : null,
              },
              {
                name: 'HTML',
                code: this.state.html,
                language: 'html',
              },
              {
                name: 'JSON (Data Only)',
                code: dataString,
                language: 'json',
              },
            ]}
          />
        </CodeBlockWrapper>
      </OverviewWrapper>
    );
  }
}

Overview.defaultProps = {
  data: {},
  demoSizes: [],
  size: 'l',
  uiSchema: {},
  isInline: false,
};

Overview.propTypes = {
  template: PropTypes.string.isRequired,
  data: PropTypes.object,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  isInline: PropTypes.bool,
  demoSizes: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.oneOf(sizes.map(size => size.value)),
};

export default Overview;
