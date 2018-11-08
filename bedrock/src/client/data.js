import urlJoin from 'url-join';

const apiUrlBase = '/api'; // @todo refactor

export const ENDPOINTS = {
  DESIGN_TOKENS: urlJoin(apiUrlBase, 'design-tokens'),
};

// @todo make every `fetch` function use this function
async function request(endpoint) {
  /** @type {Response} */
  const response = await window.fetch(endpoint);
  const { ok, status, statusText } = response;
  if (ok) {
    return response.json();
  }
  return {
    ok: false,
    message: `Error hitting endpoint, received ${status}: ${statusText}`,
  };
}

/**
 * @return {Promise<string[]>}
 */
export function getAvailableTokenCategories() {
  return window
    .fetch(ENDPOINTS.DESIGN_TOKENS)
    .then(res => res.json())
    .then(x => x.map(y => y.id))
    .catch(console.log.bind(console));
}

/**
 * @param {string} category
 * @return {Promise<GenericResponse>}
 */
export async function getDesignTokensCategory(category) {
  try {
    /** @type {Response} */
    const response = await window.fetch(
      urlJoin(apiUrlBase, 'design-token', category),
    );
    if (response.ok) {
      return response.json();
    }
    return {
      ok: false,
      message: `No api endpoint for ${category} available, so probably no tokens for it.`,
    };
  } catch (err) {
    return {
      ok: false,
      message: `No api endpoint for ${category} available, so probably no tokens for it.`,
    };
  }
}

export async function getDesignTokensCategories(categories) {
  const availableCategories = await getAvailableTokenCategories();
  const results = {};

  return Promise.all(
    categories
      .filter(category => availableCategories.includes(category))
      .map(category =>
        getDesignTokensCategory(category).then(tokens => ({
          [category]: tokens,
        })),
      ),
  )
    .then(allTokens => {
      allTokens.forEach(allToken => {
        const [id] = Object.keys(allToken);
        const tokens = allToken[id];
        if (tokens.ok) {
          results[id] = tokens.data;
        }
      });

      return {
        ok: true,
        data: results,
      };
    })
    .catch(err => {
      console.error('Error: getDesignTokensCategories', err);
    });
}
