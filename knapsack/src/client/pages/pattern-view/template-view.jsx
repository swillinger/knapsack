/**
 *  Copyright (C) 2018 Basalt
 This file is part of Knapsack.
 Knapsack is free software; you can redistribute it and/or modify it
 under the terms of the GNU General Public License as published by the Free
 Software Foundation; either version 2 of the License, or (at your option)
 any later version.

 Knapsack is distributed in the hope that it will be useful, but WITHOUT
 ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
 more details.

 You should have received a copy of the GNU General Public License along
 with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  SchemaForm,
  Spinner,
  Button,
  Details,
  Select,
  StatusMessage,
} from '@knapsack/design-system';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { KnapsackContext } from '../../context';
import MdBlock from '../../components/md-block';
import Template from '../../components/template';
import TemplateCodeBlock from './template-code-block';
import {
  LoadableSchemaTable,
  LoadableVariationDemo,
} from '../../loadable-components';
// import DosAndDonts from '../../components/dos-and-donts';
import { gqlQuery, getTemplateUrl } from '../../data';
import './template-view.scss';
import './shared/demo-grid-controls.scss';

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
  static contextType = KnapsackContext;

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

    const showSchemaForm = this.props.isSchemaFormShown && hasSchema;

    const calculateDemoStageWidth = size => {
      switch (size) {
        case 's':
          return '33%';
        case 'm':
          return '50%';
        case 'l':
          return '67%';
        default:
          return '100%';
      }
    };

    const calculateSchemaFormWidth = size => {
      switch (size) {
        case 's':
          return '67%';
        case 'm':
          return '50%';
        case 'l':
          return '33%';
        default:
          return '100%';
      }
    };

    return (
      <article className="template-view">
        <div className="template-view__overview-wrapper">
          <div className="template-view__flex-wrapper">
            {!this.props.isVerbose && this.props.isTitleShown && (
              <h3>{title}</h3>
            )}
            <div className="pattern-view-demo-grid-controls">
              <Button
                onClick={() => {
                  getTemplateUrl({
                    patternId: this.props.id,
                    templateId: this.props.templateId,
                    data: this.state.data,
                    isInIframe: false,
                    wrapHtml: true,
                    assetSetId,
                  })
                    .then(externalUrl => {
                      window.open(externalUrl, '_blank');
                    })
                    .catch(console.log.bind(console));
                }}
              >
                Open in new window
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
            </div>
          </div>
          <div
            className="template-view__demo-grid"
            style={{
              display:
                (showSchemaForm ? this.props.demoSize : 'full') === 'full'
                  ? 'block'
                  : 'flex',
            }}
          >
            <div
              className="template-view__demo-stage"
              style={{
                width: calculateDemoStageWidth(
                  showSchemaForm ? this.props.demoSize : 'full',
                ),
              }}
            >
              <Template
                patternId={this.props.id}
                templateId={this.props.templateId}
                assetSetId={assetSetId}
                data={data}
                isResizable
              />
            </div>
            {showSchemaForm && (
              <div
                className="template-view__schema-form"
                style={{
                  width: calculateSchemaFormWidth(this.props.demoSize),
                }}
              >
                <div
                  className="template-view__schema-form__inner"
                  size={this.props.demoSize}
                  style={{
                    position: this.props.demoSize === 'full' ? 'static' : '',
                  }}
                >
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
                </div>
              </div>
            )}
          </div>
        </div>

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
              key={`${this.props.id}-${this.props.templateId}-${this.state.demoDataIndex}`}
            />
          </>
        )}
      </article>
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
