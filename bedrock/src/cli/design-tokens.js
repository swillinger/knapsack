const theo = require('theo');

/**
 * @typedef TheoProp
 * @prop {string} type
 * @prop {string} category
 * @prop {string} value
 * @prop {string} originalValue
 * @prop {string} name
 */

theo.registerFormat('bedrock', result => result.toJSON());

/**
 * @param {string} entryFilePath
 * @param {string} [format='bedrock']
 * @return {Promise<TheoProp[]>}
 */
async function getTokens(entryFilePath, format = 'bedrock') {
  return theo
    .convert({
      transform: {
        type: 'web',
        file: entryFilePath,
      },
      format: {
        type: format,
      },
    })
    .then(result => {
      if (format === 'bedrock') {
        return result.props;
      }
      return result;
    })
    .catch(error => {
      console.log(`Something went wrong processing Theo Tokens: ${error}`);
      process.exit(1);
    });
}

async function processTokens(entryFilePath) {
  const tokens = await getTokens(entryFilePath);
  const categories = new Set();
  tokens.forEach(token => categories.add(token.category));

  return {
    categories: [...categories],
    tokens,
  };
}

module.exports = {
  getTokens,
  processTokens,
};
