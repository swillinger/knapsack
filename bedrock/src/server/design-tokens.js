const theo = require('theo');
const { gql } = require('apollo-server-express');
const {
  TOKEN_CATS,
  BASE_PATHS,
  tokenGroups,
  tokenCategoriesWithDemo,
} = require('../lib/constants');
const { hasItemsInItems } = require('../lib/utils');

// @todo make a GraphQL `enum` out of this
const availableTokenCategories = Object.values(TOKEN_CATS); // eslint-disable-line

const designTokensTypeDef = gql`
  "A single value that can be assigned to a single CSS declaration"
  type DesignToken {
    category: String!
    name: String!
    originalValue: String
    type: String!
    value: String!
    comment: String
  }

  "Collection of tokens that can be assigned to a single CSS declaration"
  type TokenCategory {
    id: ID
    name: String
    hasDemo: Boolean
    tokens: [DesignToken]
  }

  "Multiple categories of tokens around a theme or solution. These are the pages in the navigation."
  type TokenGroup {
    id: ID!
    title: String
    path: String
    description: String
    tokenCategories: [TokenCategory]
    tokenCategoryIds: [ID]
  }

  type Query {
    tokenCategories: [TokenCategory]
    tokenCategory(category: String): TokenCategory
    tokens(category: String): [DesignToken]
    tokenGroups: [TokenGroup]
    tokenGroup(group: String): TokenGroup
  }
`;

/**
 * @typedef {Object} TheoProp
 * @prop {string} type
 * @prop {string} category
 * @prop {string} value
 * @prop {string} originalValue
 * @prop {string} name
 */

// this gets the raw data from theo
theo.registerFormat('bedrock', result => result.toJSON());

/**
 * @param {DesignToken[]} tokens
 * @returns {string[]}
 */
function getCategoryIdsUsedInTokens(tokens) {
  const categories = new Set();
  tokens.forEach(token => categories.add(token.category));
  return [...categories];
}

/**
 * @param {string} category
 * @return {boolean}
 */
function categoryHasDemo(category) {
  return tokenCategoriesWithDemo.includes(category);
}

class DesignTokens {
  constructor({ tokenPath }) {
    // @todo test to ensure it's a path that points to a single yaml file and it exists
    this.tokenPath = tokenPath;
    this.getTokensInCategory = this.getTokensInCategory.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.isCategoryUsed = this.isCategoryUsed.bind(this);

    /**
     * All Theo Design Tokens the user has
     * @type {DesignToken[]}
     * */
    this.tokens = this.convertTokens();

    /**
     * A list of all categories the user used in Theo Design Tokens
     * @type {string[]}
     */
    this.allCategoriesUsed = getCategoryIdsUsedInTokens(this.tokens);

    /**
     * Token Categories that
     * @type {TokenGroupDef[]}
     */
    this.tokenCategories = tokenGroups.filter(group =>
      hasItemsInItems(group.tokenCategoryIds, this.allCategoriesUsed),
    );

    // only include groups that have a design token category to demo
    /** @type {TokenGroup[]} */
    this.groups = this.tokenCategories.map(group => ({
      ...group,
      path: `${BASE_PATHS.DESIGN_TOKENS}/${group.id}`,
      tokenCategories: group.tokenCategoryIds
        .filter(this.isCategoryUsed)
        .map(this.getCategory),
    }));
  }

  /**
   * @param {string} [format='bedrock']
   * @return {DesignToken[]}
   */
  convertTokens(format = 'bedrock') {
    const results = theo.convertSync({
      transform: {
        type: 'web',
        file: this.tokenPath,
      },
      format: {
        type: format,
      },
    });

    if (format === 'bedrock') {
      return results.props;
    }
    return results;
  }

  /**
   * @param {string} category
   * @return {boolean}
   */
  isCategoryUsed(category) {
    return this.allCategoriesUsed.includes(category);
  }

  /**
   * @return {TokenGroup[]}
   */
  getGroups() {
    return this.groups;
  }

  /**
   * @param {string} groupId
   * @return {TokenGroup}
   */
  getGroup(groupId) {
    return this.groups.find(group => group.id === groupId);
  }

  /**
   * @param {string} groupId
   * @return {TokenCategory[]}
   */
  getCategoriesInGroup(groupId) {
    const group = this.getGroup(groupId);
    return group.tokenCategories;
  }

  /**
   * @returns {TokenCategory[]}
   */
  getCategories() {
    return this.allCategoriesUsed.map(this.getCategory);
  }

  /**
   * @param {string} category
   * @returns {DesignToken[]}
   */
  getTokensInCategory(category) {
    return this.tokens.filter(token => token.category === category);
  }

  /**
   * @param {string} category
   * @return {TokenCategory}
   */
  getCategory(category) {
    return {
      id: category,
      name: category,
      hasDemo: categoryHasDemo(category),
      tokens: this.getTokensInCategory(category),
    };
  }

  /**
   * @param {string} [category]
   * @returns {DesignToken[]}
   */
  getTokens(category = '') {
    if (category) {
      return this.tokens.filter(t => t.category === category);
    }
    return this.tokens;
  }
}

const designTokensResolvers = {
  Query: {
    tokenCategories: (parent, args, { tokens }) => tokens.getCategories(),
    tokenCategory: (parent, { category }, { tokens }) =>
      tokens.getCategory(category),
    tokens: (parent, { category }, { tokens }) => tokens.getTokens(category),
    tokenGroups: (parent, args, { tokens }) => tokens.getGroups(),
    tokenGroup: (parent, { group }, { tokens }) => tokens.getGroup(group),
  },
};

module.exports = {
  DesignTokens,
  designTokensResolvers,
  designTokensTypeDef,
};
