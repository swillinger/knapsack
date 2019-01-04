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
import { BedrockContext } from '@basalt/bedrock-core';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import MdBlock from '../components/md-block';
import ErrorCatcher from '../utils/error-catcher';
import Overview from '../layouts/overview';
import {
  LoadableSchemaTable,
  LoadableVariationDemo,
} from '../loadable-components';
// import DosAndDonts from '../components/dos-and-donts';
import PageWithSidebar from '../layouts/page-with-sidebar';
import { BASE_PATHS } from '../../lib/constants';
import { gqlToString } from '../data';
import {
  FlexWrapper,
  DemoGridControls,
  OverviewWrapper,
  PatternHeader,
} from './pattern-view-page.styles';

const query = gql`
  query PatternViewPage($id: ID) {
    pattern(id: $id) {
      id
      templates {
        id
        title
        demoDatas
        schema
        isInline
        uiSchema
      }
      readme
      meta {
        title
        description
        type
        status
        uses
        demoSize
        hasIcon
        dosAndDonts {
          title
          description
          items {
            image
            do
            caption
          }
        }
      }
    }
  }
`;

const updateReadme = gql`
  mutation UpdateReadme($id: ID!, $readme: String!) {
    setPatternReadme(id: $id, readme: $readme)
  }
`;

class PatternViewPage extends Component {
  static contextType = BedrockContext;

  constructor(props) {
    super(props);
    this.state = {
      demoSize: '',
      fullScreen: false,
      demoDataIndex: 0,
      currentTemplate: {
        name: '',
        id: '',
        schema: {},
        uiSchema: {},
        isInline: false,
      },
    };
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
      <ErrorCatcher>
        <PageWithSidebar {...this.props}>
          <Query query={query} variables={{ id: this.props.id }}>
            {({ loading, error, data: response }) => {
              if (loading) return <Spinner />;
              if (error)
                return <StatusMessage type="error" message={error.message} />;

              const {
                templates,
                meta,
                readme,
                id: patternId,
              } = response.pattern;
              const { title, description, type, demoSize } = meta;

              const {
                schema,
                uiSchema,
                isInline,
                id: templateId,
                demoDatas,
              } = this.state.currentTemplate.id
                ? this.state.currentTemplate
                : templates[0];

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

              // const dosAndDonts = schema.dosAndDonts ? schema.dosAndDonts : [];

              const theDemoSize = hasSchema
                ? this.state.demoSize || demoSize
                : 'full';

              return (
                <>
                  <PatternHeader>
                    <h4
                      className="eyebrow"
                      style={{ textTransform: 'capitalize' }}
                    >
                      {type}
                    </h4>
                    <h2>{title}</h2>
                    <p>{description}</p>
                  </PatternHeader>
                  <OverviewWrapper fullScreen={this.state.fullScreen}>
                    <FlexWrapper>
                      {templates.length > 1 && (
                        <Select
                          label="Template"
                          items={templates.map(t => ({
                            value: t.id,
                            title: t.title,
                          }))}
                          handleChange={value => {
                            this.setState({
                              demoDataIndex: 0,
                              currentTemplate: templates.find(
                                t => t.id === value,
                              ),
                            });
                          }}
                        />
                      )}
                      <DemoGridControls>
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
                        {hasSchema && (
                          <Select
                            items={[
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
                            ]}
                            value={this.state.demoSize}
                            handleChange={newDemoSize =>
                              this.setState({ demoSize: newDemoSize })
                            }
                            label="Stage"
                          />
                        )}

                        <Button
                          type="button"
                          className="button button--size-small"
                          onClick={() =>
                            this.setState(prevState => ({
                              fullScreen: !prevState.fullScreen,
                            }))
                          }
                        >
                          {this.state.fullScreen
                            ? 'Show Controls'
                            : 'Fullscreen'}
                        </Button>

                        {this.context.permissions.includes('write') && (
                          <Link
                            to={`${BASE_PATHS.PATTERN}/${this.props.id}/edit`}
                          >
                            <Button>Edit Meta</Button>
                          </Link>
                        )}

                        <Button>
                          <Link
                            to={`${
                              BASE_PATHS.GRAPHIQL_PLAYGROUND
                            }?${queryString.stringify({
                              query: gqlToString(query),
                              variables: JSON.stringify({
                                id: this.props.id,
                              }),
                            })}`}
                          >
                            See API
                          </Link>
                        </Button>
                      </DemoGridControls>
                    </FlexWrapper>

                    <Overview
                      templateId={templateId}
                      hasSchema={hasSchema}
                      schema={schema}
                      uiSchema={uiSchema}
                      data={datas[this.state.demoDataIndex]}
                      demoSize={theDemoSize}
                      key={`${patternId}-${templateId}-${
                        this.state.demoDataIndex
                      }`}
                      isInline={isInline}
                      patternId={this.props.id}
                    />
                  </OverviewWrapper>

                  {readme && (
                    <Mutation mutation={updateReadme} ignoreResults>
                      {(setPatternReadme, { error: mutationError }) => {
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
                            isEditable={this.context.permissions.includes(
                              'write',
                            )}
                            title="Documentation"
                            handleSave={newReadme => {
                              setPatternReadme({
                                variables: {
                                  id,
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
              );
            }}
          </Query>
        </PageWithSidebar>
      </ErrorCatcher>
    );
  }
}

PatternViewPage.defaultProps = {};

PatternViewPage.propTypes = {
  id: PropTypes.string.isRequired,
};

export default PatternViewPage;
