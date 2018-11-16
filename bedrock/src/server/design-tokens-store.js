const theo = require('theo');
const { TOKEN_GROUPS } = require('../lib/constants');
const { hasItemsInItems } = require('../lib/utils');

/**
 * @typedef {Object} TheoProp
 * @prop {string} type
 * @prop {string} category
 * @prop {string} value
 * @prop {string} originalValue
 * @prop {string} name
 */

theo.registerFormat('bedrock', result => result.toJSON());

class DesignTokensStore {
  constructor({ tokenPath }) {
    this.tokenPath = tokenPath;
    /** @type {TheoProp[]} */
    this.tokens = this.convertTokens();
    const possibleGroups = Object.values(TOKEN_GROUPS);
    // only include groups that have a design token category to demo
    this.groups = possibleGroups.filter(group =>
      hasItemsInItems(group.tokenCategories, this.getCategories()),
    );
  }

  /**
   * @param {string} [format='bedrock']
   * @return {TheoProp[]}
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
   * @param {string} [group]
   * @return {Object[]}
   */
  getGroups(group) {
    if (group) {
      return this.groups.filter(g => g.id === group);
    }
    return this.groups;
  }

  /**
   * @returns {string[]}
   */
  getCategories() {
    const categories = new Set();
    this.tokens.forEach(token => categories.add(token.category));

    return [...categories];
  }

  /**
   * @param {string} category
   * @returns {TheoProp[]}
   */
  getCategory(category) {
    return this.tokens.filter(token => token.category === category);
  }

  /**
   * @param {string} [category]
   * @returns {TheoProp[]}
   */
  getTokens(category) {
    if (category) {
      return this.tokens.filter(t => t.category === category);
    }
    return this.tokens;
  }
}

module.exports = DesignTokensStore;
