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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '@basalt/bedrock-spinner';
import { Button, Details, Select, StatusMessage } from '@basalt/bedrock-atoms';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { BedrockContext } from '@basalt/bedrock-core';
import SchemaForm from '@basalt/bedrock-schema-form';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import qs from 'qs';
import MdBlock from '../../components/md-block';
import Template from '../../components/template';
import TemplateCodeBlock from './template-code-block';
import {
  LoadableSchemaTable,
  LoadableVariationDemo,
} from '../../loadable-components';
// import DosAndDonts from '../../components/dos-and-donts';
import {
  FlexWrapper,
  DemoGridControls,
  OverviewWrapper,
} from './pattern-view-page.styles';
import {
  DemoGrid,
  DemoStage,
  SchemaFormWrapper,
  SchemaFormWrapperInner,
} from './pattern-stage.styles';
import { gqlQuery } from '../../data';

const patternQuery = gql`
  query TemplateView($id: ID) {
    pattern(id: $id) {
      id
      templates {
        id
        title
        schema
        isInline
        uiSchema
        doc
        demoSize
        demoDatas
        hideCodeBlock
        assetSets {
          id
          title
        }
      }
    }
  }
`;

const updateReadme = gql`
  mutation UpdateReadme($id: ID!, $templateId: ID!, $readme: String!) {
    setPatternTemplateReadme(
      id: $id
      templateId: $templateId
      readme: $readme
    ) {
      id
      templates {
        id
        doc
      }
    }
  }
`;

class TemplateView extends Component {
  static contextType = BedrockContext;

  constructor(props) {
    super(props);
    this.state = {
      demoDataIndex: 0,
      demoDatas: [],
      data: {},
      hasSchema: false,
      schema: null,
      uiSchema: null,
      isInline: null,
      title: null,
      ready: false,
      assetSetId: null,
      assetSets: null,
      hideCodeBlock: null,
    };
    this.handleTemplateQuery = this.handleTemplateQuery.bind(this);
  }

  componentDidMount() {
    this.handleTemplateQuery();
  }

  handleTemplateQuery() {
    gqlQuery({
      gqlQueryObj: patternQuery,
      variables: {
        id: this.props.id,
      },
    })
      .then(({ loading, error, data }) => {
        if (loading) return <Spinner />;
        if (error) return console.error('gql error', { error });
        const { templates } = data.pattern;

        const {
          schema,
          uiSchema,
          isInline,
          doc: readme,
          title,
          demoDatas,
          assetSets,
          hideCodeBlock,
        } = templates.find(t => t.id === this.props.templateId);

        const hasSchema = !!(
          schema &&
          schema.properties &&
          Object.keys(schema.properties).length > 0
        );

        this.setState({
          demoDataIndex: 0,
          demoDatas,
          data: demoDatas[0],
          hasSchema,
          schema,
          readme,
          uiSchema,
          isInline,
          title,
          assetSetId: assetSets[0].id,
          assetSets,
          hideCodeBlock,
          ready: true,
        });
      })
      .catch(console.log.bind(console));
  }

  render() {
    const {
      demoDataIndex,
      demoDatas,
      data,
      hasSchema,
      schema,
      readme,
      uiSchema,
      isInline,
      title,
      ready,
      assetSetId,
      assetSets,
      hideCodeBlock,
    } = this.state;

    if (!ready) return <div>Loading</div>;

    const queryString = qs.stringify({
      templateId: this.props.templateId,
      patternId: this.props.id,
      data: qs.stringify(this.state.data),
      isInIframe: false,
      wrapHtml: true,
      assetSetId,
    });
    const externalUrl = `/api/render?${queryString}`;

    const showSchemaForm = this.props.isSchemaFormShown && hasSchema;

    return (
      <>
        <OverviewWrapper>
          <FlexWrapper>
            {!this.props.isVerbose && this.props.isTitleShown && (
              <h3>{title}</h3>
            )}
            <DemoGridControls>
              <Button>
                <a href={externalUrl} target="_blank" rel="noopener noreferrer">
                  Open in new window
                </a>
              </Button>

              {assetSets && assetSets.length > 1 && (
                <Select
                  items={assetSets.map(assetSet => ({
                    title: assetSet.title,
                    value: assetSet.id,
                  }))}
                  handleChange={newAssetSetId => {
                    this.setState({
                      assetSetId: newAssetSetId,
                    });
                  }}
                  value={assetSetId}
                  label="Asset Sets"
                />
              )}

              {demoDatas.length > 1 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      paddingRight: '3px',
                      marginRight: '5px',
                    }}
                  >
                    Demos:
                  </div>
                  <div>
                    <Button
                      type="button"
                      className="button button--size-small"
                      disabled={this.state.demoDataIndex < 1}
                      onClick={() => {
                        this.setState(prevState => ({
                          demoDataIndex: prevState.demoDataIndex - 1,
                          data:
                            prevState.demoDatas[prevState.demoDataIndex - 1],
                        }));
                      }}
                    >
                      <FaCaretLeft />
                    </Button>
                    <Button
                      type="button"
                      className="button button--size-small"
                      disabled={demoDataIndex === demoDatas.length - 1}
                      onClick={() => {
                        this.setState(prevState => ({
                          demoDataIndex: prevState.demoDataIndex + 1,
                          data:
                            prevState.demoDatas[prevState.demoDataIndex + 1],
                        }));
                      }}
                    >
                      <FaCaretRight />
                    </Button>
                  </div>
                </div>
              )}
            </DemoGridControls>
          </FlexWrapper>

          <DemoGrid size={showSchemaForm ? this.props.demoSize : 'full'}>
            <DemoStage size={showSchemaForm ? this.props.demoSize : 'full'}>
              <Template
                patternId={this.props.id}
                templateId={this.props.templateId}
                assetSetId={assetSetId}
                data={data}
                isResizable
              />
            </DemoStage>
            {showSchemaForm && (
              <SchemaFormWrapper size={this.props.demoSize}>
                <SchemaFormWrapperInner size={this.props.demoSize}>
                  <h4>Edit Form</h4>
                  <SchemaForm
                    schema={schema}
                    formData={this.state.data}
                    onChange={({ formData }) => {
                      this.setState({
                        data: formData,
                      });
                    }}
                    uiSchema={uiSchema}
                    isInline={isInline}
                  />
                </SchemaFormWrapperInner>
              </SchemaFormWrapper>
            )}
          </DemoGrid>
        </OverviewWrapper>

        {this.props.isCodeBlockShown && !hideCodeBlock && (
          <div style={{ marginBottom: '1rem' }}>
            <TemplateCodeBlock
              patternId={this.props.id}
              templateId={this.props.templateId}
              data={data}
            />
          </div>
        )}

        {this.props.isReadmeShown && readme && (
          <Mutation
            mutation={updateReadme}
            refetchQueries={() => [
              {
                query: patternQuery,
                variables: {
                  id: this.props.id,
                },
              },
            ]}
          >
            {(setPatternTemplateReadme, { error: mutationError }) => {
              const { id } = this.props;
              if (mutationError)
                return (
                  <StatusMessage message={mutationError.message} type="error" />
                );
              return (
                <MdBlock
                  md={readme}
                  key={`${this.props.id}-${this.props.templateId}`}
                  isEditable={this.context.permissions.includes('write')}
                  title="Documentation"
                  handleSave={newReadme => {
                    setPatternTemplateReadme({
                      variables: {
                        id,
                        templateId: this.props.templateId,
                        readme: newReadme,
                      },
                    });
                  }}
                />
              );
            }}
          </Mutation>
        )}

        {this.props.isVerbose && hasSchema && (
          <>
            <div>
              <h4>Properties</h4>
              <p>
                The following properties make up the data that defines each
                instance of this component.
              </p>
              <Details open>
                <summary>Props Table</summary>
                <LoadableSchemaTable schema={schema} />
              </Details>
            </div>

            <LoadableVariationDemo
              schema={schema}
              templateId={this.props.templateId}
              patternId={this.props.id}
              data={demoDatas[this.state.demoDataIndex]}
              key={`${this.props.id}-${this.props.templateId}-${
                this.state.demoDataIndex
              }`}
            />
          </>
        )}
      </>
    );
  }
}

TemplateView.defaultProps = {
  isVerbose: true,
  demoSize: 'full',
  isReadmeShown: true,
  isTitleShown: true,
  isSchemaFormShown: true,
  isCodeBlockShown: false,
};

TemplateView.propTypes = {
  id: PropTypes.string.isRequired,
  templateId: PropTypes.string.isRequired,
  isVerbose: PropTypes.bool,
  demoSize: PropTypes.string,
  isReadmeShown: PropTypes.bool,
  isTitleShown: PropTypes.bool,
  isSchemaFormShown: PropTypes.bool,
  isCodeBlockShown: PropTypes.bool,
};

export default TemplateView;
