import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Spinner from '@basalt/bedrock-spinner';
import { Details, Select } from '@basalt/bedrock-atoms';
import { connectToContext, contextPropTypes } from '@basalt/bedrock-core';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Template from '../components/template';
import ErrorCatcher from '../utils/error-catcher';
import Overview from '../layouts/overview';
import {
  LoadableSchemaTable,
  LoadableVariationDemo,
} from '../loadable-components';
import DosAndDonts from '../components/dos-and-donts';

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

class PatternViewPage extends Component {
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

    // this.apiEndpoint = `${apiUrlBase}/pattern/${props.id}`;
    this.enableTemplatePush = this.props.context.features.enableTemplatePush;
    this.websocketsPort = this.props.context.meta.websocketsPort;
  }

  componentDidMount() {
    if (this.enableTemplatePush) {
      this.socket = new window.WebSocket(
        `ws://localhost:${this.websocketsPort}`,
      );

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
    if (this.enableTemplatePush) {
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
            });
            return null;
          }}
        </Query>
      );
    }

    const { templates, meta, currentTemplate } = this.state;
    const { title, description, type, demoSize } = meta;
    const { name, schema, uiSchema, isInline } = currentTemplate;
    const [data, ...examples] = schema.examples ? schema.examples : [{}];
    const dosAndDonts = schema.dosAndDonts ? schema.dosAndDonts : [];
    return (
      <ErrorCatcher>
        <article>
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

          {examples && (
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
        </article>
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
  context: contextPropTypes.isRequired,
};

export default connectToContext(PatternViewPage);
