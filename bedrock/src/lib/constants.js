/**
 * Base Paths for URLs
 * DO NOT INCLUDE TRAILING SLASH!
 */
const BASE_PATHS = {
  PATTERNS: '/patterns',
  DESIGN_TOKENS: '/design-tokens',
  PAGES: '/pages',
  CUSTOM_PAGES: '/custom-pages',
  GRAPHIQL_PLAYGROUND: '/graphql-playground',
};

const FILE_NAMES = {
  PATTERN: 'bedrock.pattern.js',
  PATTERN_META: 'bedrock.pattern-meta.json',
  CONFIG: 'bedrock.config.js',
};

module.exports = {
  USER_SITE_PUBLIC: '/user-site-public',
  BASE_PATHS,
  FILE_NAMES,
};
