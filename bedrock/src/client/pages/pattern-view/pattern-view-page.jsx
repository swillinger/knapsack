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
import { Button, Select, StatusMessage } from '@basalt/bedrock-atoms';
import { BedrockContext } from '@basalt/bedrock-core';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorCatcher from '../../utils/error-catcher';
// import DosAndDonts from '../../components/dos-and-donts';
import PageWithSidebar from '../../layouts/page-with-sidebar';
import TemplateView from './template-view';
import { PatternHeader } from './pattern-view-page.styles';

const query = gql`
  query PatternViewPage($id: ID) {
    pattern(id: $id) {
      id
      templates {
        id
        title
      }
      meta {
        title
        description
        type
        status
        uses
        hasIcon
      }
    }
  }
`;

class PatternViewPage extends Component {
  static contextType = BedrockContext;

  constructor(props) {
    super(props);
    this.state = {
      showAllTemplates: false, // @todo lift this from the pattern meta on initial mount
      currentTemplate: {
        name: '',
        id: '',
      },
    };
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

              const { templates, meta } = response.pattern;
              const { title, description, type } = meta;
              const { id: templateId } = this.state.currentTemplate.id
                ? this.state.currentTemplate
                : templates[0];

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
                    {templates.length > 1 && (
                      <>
                        {!this.state.showAllTemplates && (
                          <Select
                            label="Template"
                            value={templateId}
                            items={templates.map(t => ({
                              value: t.id,
                              title: t.title,
                            }))}
                            handleChange={value => {
                              this.setState({
                                currentTemplate: templates.find(
                                  t => t.id === value,
                                ),
                              });
                            }}
                          />
                        )}
                        <Button
                          type="button"
                          className="button button--size-small"
                          onClick={() =>
                            this.setState(prevState => ({
                              showAllTemplates: !prevState.showAllTemplates,
                            }))
                          }
                        >
                          {this.state.showAllTemplates
                            ? 'Show One Template'
                            : 'Show All Template'}
                        </Button>
                      </>
                    )}
                  </PatternHeader>
                  <TemplateView
                    id={this.props.id}
                    templateId={templateId}
                    verbose={!this.state.showAllTemplates}
                  />
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
  id: PropTypes.string.isRequired,
};

export default PatternViewPage;
