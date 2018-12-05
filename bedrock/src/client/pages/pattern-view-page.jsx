import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Spinner from '@basalt/bedrock-spinner';
import { Button, Details, Select } from '@basalt/bedrock-atoms';
import { BedrockContext } from '@basalt/bedrock-core';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import Template from '../components/template';
import MdBlock from '../components/md-block';
import ErrorCatcher from '../utils/error-catcher';
import Overview from '../layouts/overview';
import {
  LoadableSchemaTable,
  LoadableVariationDemo,
} from '../loadable-components';
import DosAndDonts from '../components/dos-and-donts';
import PageWithSidebar from '../layouts/page-with-sidebar';
import { BASE_PATHS } from '../../lib/constants';
import { enableUiSettings } from '../../lib/features';
import { gqlToString } from '../data';

const OverviewHeader = styled.header`
  position: relative;
  margin-bottom: 2rem;
`;

const query = gql`
  query PatternViewPage($id: ID) {
    pattern(id: $id) {
      id
      templates {
        name
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
      currentTemplate: {
        name: '',
        schema: {},
        uiSchema: {},
        isInline: false,
      },
      meta: null,
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
          this.setState({ meta: null });
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
    if (!this.state.meta) {
      return (
        <Query query={query} variables={{ id: this.props.id }}>
          {({ loading, error, data }) => {
            if (loading) return <Spinner />;
            if (error) return <p>Error :(</p>;
            this.setState({
              meta: data.pattern.meta,
              templates: data.pattern.templates,
              currentTemplate: data.pattern.templates[0],
              readme: data.pattern.readme,
            });
            return null;
          }}
        </Query>
      );
    }

    const { templates, meta, currentTemplate, readme } = this.state;
    const { title, description, type, demoSize } = meta;
    const { name, schema, uiSchema, isInline } = currentTemplate;
    const [data, ...examples] = schema.examples ? schema.examples : [{}];
    const dosAndDonts = schema.dosAndDonts ? schema.dosAndDonts : [];
    return (
      <ErrorCatcher>
        <PageWithSidebar {...this.props}>
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <OverviewHeader>
              <h4 className="eyebrow" style={{ textTransform: 'capitalize' }}>
                {type}
              </h4>
              <h2>{title}</h2>
              <p>{description}</p>
              {templates.length > 1 && (
                <Select
                  label="Template"
                  items={templates.map(t => ({
                    value: t.name,
                    title: t.schema.title,
                  }))}
                  handleChange={value => {
                    this.setState({
                      currentTemplate: templates.find(t => t.name === value),
                    });
                  }}
                />
              )}
            </OverviewHeader>
            <Button>
              <Link
                to={`${BASE_PATHS.GRAPHIQL_PLAYGROUND}?${queryString.stringify({
                  query: gqlToString(query),
                  variables: JSON.stringify({
                    id: this.props.id,
                  }),
                })}`}
              >
                See API
              </Link>
            </Button>
          </header>

          <Overview
            template={name}
            schema={schema}
            uiSchema={uiSchema}
            demoSizes={this.props.demoSizes}
            data={data}
            size={demoSize}
            key={name}
            isInline={isInline}
            id={this.props.id}
          />

          {!!examples.length && (
            <Details>
              <summary>Examples</summary>
              {examples.map(example => (
                <Template
                  template={name}
                  data={example}
                  key={JSON.stringify(example)}
                />
              ))}
            </Details>
          )}

          {readme && (
            <Mutation mutation={updateReadme} ignoreResults>
              {setPatternReadme => {
                const { id } = this.props;
                return (
                  <MdBlock
                    md={readme}
                    isEditable={enableUiSettings}
                    title="Documentation"
                    handleSave={async newReadme => {
                      await setPatternReadme({
                        variables: {
                          id,
                          readme: newReadme,
                        },
                      });
                      // @todo Refactor this so a reload is not needed
                      window.location.reload();
                    }}
                  />
                );
              }}
            </Mutation>
          )}

          {Object.keys(schema.properties).length > 0 && (
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
          )}

          <LoadableVariationDemo schema={schema} template={name} data={data} />

          {dosAndDonts.map(item => (
            <DosAndDonts
              key={JSON.stringify(item)}
              title={item.title}
              description={item.description}
              items={item.items}
            />
          ))}

          {/* <ApiDemo endpoint={this.apiEndpoint} /> */}
        </PageWithSidebar>
      </ErrorCatcher>
    );
  }
}

PatternViewPage.defaultProps = {
  // @todo this is a hotfix and needs to be refactored
  demoSizes: ['s', 'm', 'l'],
};

PatternViewPage.propTypes = {
  id: PropTypes.string.isRequired,
  demoSizes: PropTypes.arrayOf(PropTypes.string.isRequired),
};

export default PatternViewPage;
