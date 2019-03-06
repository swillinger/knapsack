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
import Spinner from '@basalt/bedrock-spinner';
import { Button, Select, StatusMessage } from '@basalt/bedrock-atoms';
import { BedrockContext } from '@basalt/bedrock-core';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import ErrorCatcher from '../../utils/error-catcher';
// import DosAndDonts from '../../components/dos-and-donts';
import { PatternStatusIcon } from '../../components/atoms';
import { BASE_PATHS } from '../../../lib/constants';
import { gqlToString } from '../../data';
import PageWithSidebar from '../../layouts/page-with-sidebar';
import TemplateView from './template-view';
import { PatternHeader, DemoGridControls } from './pattern-view-page.styles';

const query = gql`
  query PatternViewPage($id: ID) {
    pattern(id: $id) {
      id
      templates {
        id
        title
        schema
      }
      meta {
        title
        description
        type
        demoSize
        status
      }
    }
    patternStatuses {
      id
      title
      color
    }
  }
`;

class PatternViewPage extends Component {
  static contextType = BedrockContext;

  constructor(props) {
    super(props);
    this.state = {
      isFullScreen: false,
      demoSize: '',
    };
  }

  render() {
    const { patternId, templateId } = this.props;

    return (
      <ErrorCatcher>
        <PageWithSidebar {...this.props} isFullScreen={this.state.isFullScreen}>
          <Query query={query} variables={{ id: patternId }}>
            {({ loading, error, data: response }) => {
              if (loading) return <Spinner />;
              if (error)
                return <StatusMessage type="error" message={error.message} />;

              const showAllTemplates = templateId === 'all';

              const { pattern, patternStatuses } = response;
              const { templates, meta } = pattern;
              const {
                title,
                description,
                type,
                demoSize: defaultDemoSize,
                status: statusId,
              } = meta;

              const demoSize = this.state.demoSize
                ? this.state.demoSize
                : defaultDemoSize;

              let hasSchema;
              if (showAllTemplates) {
                hasSchema = !!(
                  showAllTemplates &&
                  !!templates.find(
                    t =>
                      t.schema &&
                      t.schema.properties &&
                      Object.keys(t.schema.properties).length > 0,
                  )
                );
              } else {
                const currentlySelectedTemplate = templates.find(
                  t => t.id === templateId,
                );

                hasSchema = !!(
                  currentlySelectedTemplate.schema &&
                  currentlySelectedTemplate.schema.properties &&
                  Object.keys(currentlySelectedTemplate.schema.properties)
                    .length > 0
                );
              }

              const status = patternStatuses.find(p => p.id === statusId);

              return (
                <>
                  <PatternHeader>
                    <div>
                      <h4
                        className="eyebrow"
                        style={{ textTransform: 'capitalize' }}
                      >
                        {type}
                      </h4>
                      <h2 style={{ marginBottom: '0' }}>{title}</h2>
                      {status && (
                        <h5 className="eyebrow" style={{ marginBottom: '0' }}>
                          Status: {status.title}
                          <PatternStatusIcon
                            color={status.color}
                            title={status.title}
                          />
                        </h5>
                      )}
                      <p style={{ marginTop: '1rem' }}>{description}</p>
                    </div>
                    <div>
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
                            value={demoSize}
                            handleChange={newDemoSize =>
                              this.setState({ demoSize: newDemoSize })
                            }
                            label="Stage Size"
                          />
                        )}
                      </DemoGridControls>
                      <DemoGridControls>
                        <Button
                          type="button"
                          className="button button--size-small"
                          onClick={() =>
                            this.setState(prevState => ({
                              isFullScreen: !prevState.isFullScreen,
                            }))
                          }
                        >
                          {this.state.isFullScreen
                            ? 'Show Controls'
                            : 'Fullscreen'}
                        </Button>

                        {this.context.permissions.includes('write') && (
                          <Link to={`${BASE_PATHS.PATTERN}/${patternId}/edit`}>
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
                                id: patternId,
                              }),
                            })}`}
                          >
                            See API
                          </Link>
                        </Button>
                      </DemoGridControls>
                      <DemoGridControls>
                        {templates.length > 1 && (
                          <Select
                            label="Template"
                            value={templateId}
                            items={[
                              {
                                value: 'all',
                                title: 'Show All',
                              },
                              ...templates.map(t => ({
                                value: t.id,
                                title: t.title,
                              })),
                            ]}
                            handleChange={value => {
                              this.props.history.push(
                                `${BASE_PATHS.PATTERN}/${patternId}/${value}`,
                              );
                            }}
                          />
                        )}
                      </DemoGridControls>
                    </div>
                  </PatternHeader>

                  {!showAllTemplates && (
                    <TemplateView
                      id={patternId}
                      templateId={templateId}
                      key={`${patternId}-${templateId}`}
                      demoSize={this.state.demoSize || defaultDemoSize}
                      isVerbose
                      isCodeBlockShown
                    />
                  )}

                  {showAllTemplates &&
                    templates.map(template => (
                      <div key={template.id}>
                        <TemplateView
                          id={patternId}
                          key={template.id}
                          templateId={template.id}
                          demoSize={this.state.demoSize || defaultDemoSize}
                          isVerbose={!showAllTemplates}
                        />
                        <br />
                        <hr />
                        <br />
                      </div>
                    ))}

                  {/* {dosAndDonts.map(item => ( */}
                  {/* <DosAndDonts */}
                  {/* key={JSON.stringify(item)} */}
                  {/* title={item.title} */}
                  {/* description={item.description} */}
                  {/* items={item.items} */}
                  {/* /> */}
                  {/* ))} */}
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
  patternId: PropTypes.string.isRequired,
  templateId: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default PatternViewPage;
