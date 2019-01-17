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
import { Details, Select, StatusMessage } from '@basalt/bedrock-atoms';
import { BedrockContext } from '@basalt/bedrock-core';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Template from '../../components/template';
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

const query = gql`
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
      }
      meta {
        title
        description
        type
        status
        uses
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

// @todo UpdateReadme needs to work for each template doc
const updateReadme = gql`
  mutation UpdateReadme($id: ID!, $readme: String!) {
    setPatternReadme(id: $id, readme: $readme)
  }
`;

class TemplateView extends Component {
  static contextType = BedrockContext;

  constructor(props) {
    super(props);
    this.state = {
      demoSize: '',
    };
  }

  componentDidMount() {
    const { websocketsPort } = this.context.meta;
    if (this.context.features.enableTemplatePush && websocketsPort) {
      this.socket = new window.WebSocket(
        `ws://localhost:${websocketsPort + this.props.socketPortOffset}`,
      );

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
      <Query query={query} variables={{ id: this.props.id }}>
        {({ loading, error, data: response }) => {
          if (loading) return <Spinner />;
          if (error)
            return <StatusMessage type="error" message={error.message} />;
          console.log(response);
          const { templates, id: patternId } = response.pattern;

          const {
            schema,
            uiSchema,
            isInline,
            id: templateId,
            doc: readme,
            title,
            demoSize,
          } = templates.find(t => t.id === this.props.templateId);
          const [data, ...examples] = schema.examples ? schema.examples : [{}];
          // const dosAndDonts = schema.dosAndDonts ? schema.dosAndDonts : [];

          const hasSchema = !!(
            schema &&
            schema.properties &&
            Object.keys(schema.properties).length > 0
          );
          const theDemoSize = hasSchema
            ? this.state.demoSize || demoSize
            : 'full';

          return (
            <>
              <OverviewWrapper fullScreen={this.state.fullScreen}>
                <FlexWrapper>
                  {!this.props.isVerbose && <h3>{title}</h3>}
                  <DemoGridControls>
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
                        value={this.state.demoSize || demoSize}
                        handleChange={newDemoSize =>
                          this.setState({ demoSize: newDemoSize })
                        }
                        label="Stage Size"
                      />
                    )}
                  </DemoGridControls>
                </FlexWrapper>
                <PatternStage
                  templateId={templateId}
                  hasSchema={hasSchema}
                  schema={schema}
                  uiSchema={uiSchema}
                  data={data}
                  demoSize={theDemoSize}
                  key={`${patternId}-${templateId}`}
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
                        key={`${patternId}-${templateId}`}
                        isEditable={this.context.permissions.includes('write')}
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
                        data={data}
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

                  {!!examples.length && (
                    <Details>
                      <summary>Extra Examples</summary>
                      {examples.map(example => (
                        <Template
                          patternId={patternId}
                          templateId={templateId}
                          data={example}
                          key={JSON.stringify(example)}
                        />
                      ))}
                    </Details>
                  )}

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
  socketPortOffset: 0,
  isVerbose: true,
};

TemplateView.propTypes = {
  id: PropTypes.string.isRequired,
  templateId: PropTypes.string.isRequired,
  isVerbose: PropTypes.bool,
  socketPortOffset: PropTypes.number,
};

export default TemplateView;
