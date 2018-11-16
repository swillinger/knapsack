const theo = require('theo');

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
   * @returns {TheoProp[]}
   */
  getTokens() {
    return this.tokens;
  }
}

module.exports = DesignTokensStore;
