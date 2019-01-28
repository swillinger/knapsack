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
import { Button, Details, StatusMessage } from '@basalt/bedrock-atoms';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { BedrockContext } from '@basalt/bedrock-core';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import qs from 'qs';
import MdBlock from '../../components/md-block';
import PatternStage from './pattern-stage';
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
      }
    }
  }
`;

// @todo UpdateReadme needs to work for each template doc
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
      data: null,
    };
    // this.setData = this.setData.bind(this);
  }

  componentDidMount() {
    const { websocketsPort } = this.context.meta;
    if (this.context.features.enableTemplatePush && websocketsPort) {
      this.socket = new window.WebSocket(`ws://localhost:${websocketsPort}`);

      // this.socket.addEventListener('open', event => {
      //   this.socket.send('Hello Server!', event);
      // });

      this.socket.addEventListener('message', event => {
        const { ext } = JSON.parse(event.data);
        // console.log('Message from server ', ext, event.data);
        if (ext !== '.twig') {
          // @todo improve. Need to refresh data.
          // this.setState({ meta: null });
        }
      });
    }
  }

  componentWillUnmount() {
    if (
      this.context.features.enableTemplatePush &&
      this.context.meta.websocketsPort
    ) {
      this.socket.close(1000, 'componentWillUnmount called');
    }
  }

  render() {
    return (
      <Query query={patternQuery} variables={{ id: this.props.id }}>
        {({ loading, error, data: response }) => {
          if (loading) return <Spinner />;
          if (error)
            return <StatusMessage type="error" message={error.message} />;
          const { templates, id: patternId } = response.pattern;

          const {
            schema,
            uiSchema,
            isInline,
            id: templateId,
            doc: readme,
            title,
            demoDatas,
          } = templates.find(t => t.id === this.props.templateId);
          // const dosAndDonts = schema.dosAndDonts ? schema.dosAndDonts : [];
          const hasSchema = !!(
            schema &&
            schema.properties &&
            Object.keys(schema.properties).length > 0
          );

          let datas = [{}];
          if (demoDatas) {
            datas = demoDatas;
          } else if (
            hasSchema &&
            schema.examples &&
            schema.examples.length > 0
          ) {
            datas = schema.examples;
          }

          const queryString = qs.stringify({
            templateId: this.props.templateId,
            patternId: this.props.id,
            data: qs.stringify(
              this.state.data
                ? this.state.data
                : datas[this.state.demoDataIndex],
            ),
            isInIframe: false,
            wrapHtml: true,
          });
          const externalUrl = `/api/render?${queryString}`;

          return (
            <>
              <OverviewWrapper>
                <FlexWrapper>
                  {!this.props.isVerbose && <h3>{title}</h3>}
                  <DemoGridControls>
                    <Button>
                      <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open in new window
                      </a>
                    </Button>
                    {datas.length > 1 && (
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
                              }));
                            }}
                          >
                            <FaCaretLeft />
                          </Button>
                          <Button
                            type="button"
                            className="button button--size-small"
                            disabled={
                              this.state.demoDataIndex === datas.length - 1
                            }
                            onClick={() => {
                              this.setState(prevState => ({
                                demoDataIndex: prevState.demoDataIndex + 1,
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
                <PatternStage
                  templateId={templateId}
                  hasSchema={hasSchema}
                  key={`${patternId}-${templateId}`}
                  schema={schema}
                  uiSchema={uiSchema}
                  data={datas[this.state.demoDataIndex]}
                  demoSize={hasSchema ? this.props.demoSize : 'full'}
                  isInline={isInline}
                  patternId={this.props.id}
                  handleNewData={newData => {
                    this.setState({
                      data: newData,
                    });
                  }}
                />
              </OverviewWrapper>

              {readme && (
                <Mutation
                  mutation={updateReadme}
                  refetchQueries={() => [
                    {
                      query: patternQuery,
                      variables: {
                        id: patternId,
                      },
                    },
                  ]}
                >
                  {(setPatternTemplateReadme, { error: mutationError }) => {
                    const { id } = this.props;
                    if (mutationError)
                      return (
                        <StatusMessage
                          message={mutationError.message}
                          type="error"
                        />
                      );
                    return (
                      <MdBlock
                        md={readme}
                        key={`${patternId}-${templateId}`}
                        isEditable={this.context.permissions.includes('write')}
                        title="Documentation"
                        handleSave={newReadme => {
                          setPatternTemplateReadme({
                            variables: {
                              id,
                              templateId,
                              readme: newReadme,
                            },
                          });

                          // @todo Refactor this so a reload is not needed
                          // window.location.reload();
                        }}
                      />
                    );
                  }}
                </Mutation>
              )}

              {this.props.isVerbose && (
                <>
                  {hasSchema && (
                    <>
                      <div>
                        <h4>Properties</h4>
                        <p>
                          The following properties make up the data that defines
                          each instance of this component.
                        </p>
                        <Details open>
                          <summary>Props Table</summary>
                          <LoadableSchemaTable schema={schema} />
                        </Details>
                      </div>

                      <LoadableVariationDemo
                        schema={schema}
                        templateId={templateId}
                        patternId={patternId}
                        data={datas[this.state.demoDataIndex]}
                        key={`${patternId}-${templateId}-${
                          this.state.demoDataIndex
                        }`}
                      />
                    </>
                  )}

                  {/* {dosAndDonts.map(item => ( */}
                  {/* <DosAndDonts */}
                  {/* key={JSON.stringify(item)} */}
                  {/* title={item.title} */}
                  {/* description={item.description} */}
                  {/* items={item.items} */}
                  {/* /> */}
                  {/* ))} */}

                  {/* <ApiDemo endpoint={this.apiEndpoint} /> */}
                </>
              )}
            </>
          );
        }}
      </Query>
    );
  }
}

TemplateView.defaultProps = {
  isVerbose: true,
  demoSize: 'full',
};

TemplateView.propTypes = {
  id: PropTypes.string.isRequired,
  templateId: PropTypes.string.isRequired,
  isVerbose: PropTypes.bool,
  demoSize: PropTypes.string,
};

export default TemplateView;
