import React from 'react';
import gql from 'graphql-tag';
import SchemaForm from '@knapsack/schema-form';
import CopyToClipboard from '@knapsack/copy-to-clipboard';
import {
  DesignTokenTable,
  // AnimationDemo,
  BorderRadiusDemo,
  BorderDemo,
  BoxShadowDemo,
  // FontFamilyDemo,
  // FontSizeDemo,
  // FontWeightDemo,
  SpacingDemo,
  TextColorDemo,
  TextShadowDemo,
} from '@knapsack/design-token-demos';
import ColorSwatches from '@knapsack/color-swatch';
import BreakpointsDemo from '@knapsack/breakpoints-demo';
import { gqlQuery } from '../../../data';
import { containsString } from '../../../utils/string-helpers';

// @todo remove this and fix
/* eslint-disable react/prop-types, class-methods-use-this */

/**
 * Is Some Of This Array In That Array?
 * Are any of the items in arrayA in arrayB?
 * @param {[]} arrayA
 * @param {[]} arrayB
 * @return {boolean}
 */
function hasItemsInItems(arrayA, arrayB) {
  return arrayA.some(a => arrayB.includes(a));
}

const demos = [
  {
    id: 'color-swatch',
    title: 'Color Swatches',
    render: props => <ColorSwatches colors={props.tokens} />,
  },
  {
    id: 'spacing',
    title: 'Spacing',
    render: SpacingDemo,
  },
  {
    id: 'media-query',
    title: 'Media Queries',
    render: props => <BreakpointsDemo breakpoints={props.tokens} />,
  },
  {
    render: DesignTokenTable,
    id: 'table-list',
    title: 'Table List',
  },
  {
    id: 'simple-list',
    title: 'Simple List',
    render: ({ tokens }) => {
      if (!tokens) return null;
      return (
        <ul>
          {tokens.map(token => (
            <li key={token.name}>
              <CopyToClipboard snippet={token.code} /> -{' '}
              <CopyToClipboard snippet={token.value} />{' '}
              {token.comment && <span> {token.comment}</span>}
            </li>
          ))}
        </ul>
      );
    },
  },
  {
    id: 'box-shadow',
    title: 'Box Shadow',
    render: BoxShadowDemo,
  },
  {
    id: 'text-shadow',
    title: 'Text Shadow',
    render: TextShadowDemo,
  },
  {
    id: 'text-color',
    title: 'Text Color',
    render: TextColorDemo,
  },
  {
    id: 'border',
    title: 'Border',
    render: BorderDemo,
  },
  {
    id: 'border-radius',
    title: 'Border Radius',
    render: BorderRadiusDemo,
  },
  {
    id: 'raw-values',
    title: 'Raw Values',
    render: ({ tokens }) => (
      <details open>
        <summary>Raw Values</summary>
        <pre>
          <code>{JSON.stringify(tokens, null, '  ')}</code>
        </pre>
      </details>
    ),
  },
  // {
  //   id: 'font-family',
  //   title: 'Font Family',
  //   render: FontFamilyDemo,
  // },
  // {
  //   id: 'font-size',
  //   title: 'Font Size',
  //   render: FontSizeDemo,
  // },
  // {
  //   id: 'font-weight',
  //   title: 'font-weight',
  //   render: FontWeightDemo,
  // },
];

export const designTokenDemoSlice = {
  id: 'design-token-slice',
  title: 'Design Token Demo',
  description:
    "Filter through your whole collection of design tokens and then apply them to any design token demo you'd like",
  render: class Token extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        allTokens: [],
        formData: props.data || {
          tokens: {},
          demo: {},
        },
        ready: false,
        hasError: false,
      };
    }

    // consider adding this in since the parent component removed the unique `key` prop to ensure trigger of componentDidMount happened
    // static getDerivedStateFromProps(props, state) {
    //
    // }

    componentDidMount() {
      gqlQuery({
        gqlQueryObj: gql`
          {
            tokens {
              category
              name
              tags
              value
              comment
              originalValue
              code
            }
          }
        `,
      })
        .then(({ data }) => {
          this.setState({
            allTokens: data.tokens,
            ready: true,
          });
        })
        .catch(console.log.bind(console));
    }

    /**
     * @param {KnapsackDesignToken[]} tokens
     * @return {string[]}
     */
    getCategories(tokens) {
      const categories = new Set();
      tokens.forEach(token => categories.add(token.category));
      return [...categories].filter(Boolean);
    }

    /**
     * @param {KnapsackDesignToken[]} tokens
     * @return {string[]}
     */
    getTags(tokens) {
      const allTags = new Set();
      tokens.forEach(({ tags = [] }) => tags.forEach(t => allTags.add(t)));
      return [...allTags].filter(Boolean);
    }

    componentDidCatch(error, errorInfo) {
      console.error({ error, errorInfo });
      this.setState({
        hasError: true,
        errorMessage: error.message,
      });
    }

    render() {
      const { isEditing } = this.props;
      const {
        /** @type {KnapsackDesignToken[]} */
        allTokens,
        formData,
        ready,
        hasError,
      } = this.state;
      if (!ready) return <div>Loading...</div>;

      const {
        tokens: { category, tags: tokenTags = [], name } = {},
        demo: { id: demoId } = {},
      } = formData;

      let tokens = allTokens;

      const categories = this.getCategories(allTokens);
      if (category) {
        tokens = tokens.filter(t => t.category === category);
      }

      const tags = this.getTags(tokens);
      if (tokenTags && tokenTags.length > 0) {
        tokens = tokens.filter(t => hasItemsInItems(t.tags, tokenTags));
      }

      if (name) {
        tokens = tokens.filter(t => containsString(t.name, name));
      }

      let Demo = () => (
        <div>
          <p>
            No demo with id <code>{demoId}</code> found, it should be one of
            these:
          </p>
          <ul>
            {demos.map(d => (
              <li key={d.id}>
                <code>{d.id}</code>
              </li>
            ))}
          </ul>
        </div>
      );

      const demo = demos.find(d => d.id === demoId);
      if (demo) {
        Demo = demo.render;
      }

      return (
        <div>
          {isEditing && (
            <SchemaForm
              formData={formData}
              schema={{
                type: 'object',
                $schema: 'http://json-schema.org/draft-07/schema',
                properties: {
                  tokens: {
                    type: 'object',
                    title: 'Design Tokens',
                    description:
                      'This filters all design tokens available into a collection that is fit for your Demo.',
                    properties: {
                      category: {
                        type: 'string',
                        title: 'Design Token Category',
                        enum: categories,
                      },
                      tags: {
                        type: 'array',
                        title: 'Design Token Tags',
                        uniqueItems: true,
                        default: tags,
                        items: {
                          type: 'string',
                          enum: tags,
                        },
                      },
                      name: {
                        type: 'string',
                        title: 'Design Token Name filter',
                      },
                    },
                  },
                  demo: {
                    type: 'object',
                    title: 'Design Token Demo',
                    description: 'This is what UI displays the design tokens',
                    properties: {
                      id: {
                        type: 'string',
                        title: 'Demo',
                        enum: demos.map(d => d.id),
                        enumNames: demos.map(d => d.title),
                        default: 'raw-values',
                      },
                    },
                  },
                },
              }}
              uiSchema={{
                classNames: 'rjsf-custom-object-grid-2',
                tokens: {
                  tags: {
                    'ui:widget': 'checkboxes',
                    'ui:options': {
                      inline: true,
                    },
                  },
                },
              }}
              onChange={({ formData: newFormData }) => {
                if (
                  newFormData.tokens &&
                  newFormData.tokens.category !== formData.tokens.category
                ) {
                  this.setState({
                    formData: {
                      ...newFormData,
                      tokens: {
                        ...newFormData.tokens,
                        tags: [],
                      },
                    },
                    hasError: false,
                  });
                } else {
                  this.setState({ formData: newFormData, hasError: false });
                }
                this.props.setSliceData(newFormData);
              }}
            />
          )}

          {hasError && (
            <div>
              <h4>
                The Token Demo and Token Data do not match up, please adjust
                settings.
              </h4>
              <p>{this.state.errorMessage}</p>
            </div>
          )}

          {!hasError && (
            <div>
              {isEditing && (
                <details>
                  <summary>Token Data ({tokens.length} total)</summary>
                  <pre>
                    <code>{JSON.stringify(tokens, null, '  ')}</code>
                  </pre>
                </details>
              )}

              {tokens && <Demo tokens={tokens} />}
            </div>
          )}
        </div>
      );
    }
  },
};
