const {
  TOKEN_CATS,
  tokenCategoriesWithDemo,
  TOKEN_FORMATS,
} = require('@basalt/bedrock-design-token-demos/constants');

const TOKEN_GROUPS = {
  COLORS: {
    id: 'colors',
    title: 'Colors',
    description: 'Some colors',
    tokenCategoryIds: [
      TOKEN_CATS.BACKGROUND_COLOR,
      // TOKEN_CATS.BORDER_COLOR,
      TOKEN_CATS.TEXT_COLOR,
      TOKEN_CATS.HR_COLOR,
    ],
  },
  // BORDERS: {
  //   id: 'borders',
  //   title: 'Borders',
  //   description: 'Some borders',
  //   tokenCategoryIds: [
  //     TOKEN_CATS.BORDER_COLOR,
  //     TOKEN_CATS.BORDER_STYLE,
  //     TOKEN_CATS.BORDER_RADIUS,
  //   ],
  // },
  // @todo review
  // ANIMATIONS: {
  //   id: 'animations',
  //   title: 'Animations',
  //   description: 'Some Animations',
  //   tokenCategoryIds: [TOKEN_CATS.ANIMATION],
  // },
  SIZING: {
    id: 'sizing',
    title: 'Sizing',
    description: 'Some sizing',
    tokenCategoryIds: [
      TOKEN_CATS.SPACING,
      TOKEN_CATS.MEDIA_QUERY,
      // TOKEN_CATS.FONT_SIZE,
    ],
  },
  TYPOGRAPHY: {
    id: 'typography',
    title: 'Typography',
    description: 'Some typography',
    tokenCategoryIds: [
      TOKEN_CATS.FONT_FAMILY,
      TOKEN_CATS.FONT_SIZE,
      // these two are kinda boring; just bold or italic. should we keep?
      // TOKEN_CATS.FONT_STYLE,
      // TOKEN_CATS.FONT_WEIGHT,
      TOKEN_CATS.LINE_HEIGHT,
      TOKEN_CATS.TEXT_COLOR,
      TOKEN_CATS.TEXT_SHADOW,
    ],
  },
  SHADOWS: {
    id: 'shadows',
    title: 'Shadows',
    description: 'Some shadows',
    tokenCategoryIds: [
      TOKEN_CATS.BOX_SHADOW,
      TOKEN_CATS.INNER_SHADOW,
      TOKEN_CATS.TEXT_SHADOW,
    ],
  },
};

/** @type {TokenGroupDef[]} */
const tokenGroups = Object.values(TOKEN_GROUPS);

/**
 * Base Paths for URLs
 * DO NOT INCLUDE TRAILING SLASH!
 */
const BASE_PATHS = {
  PATTERNS: '/patterns',
  DESIGN_TOKENS: '/design-tokens',
  PAGES: '/pages',
  CUSTOM_PAGES: '/custom-pages',
};

const FILE_NAMES = {
  PATTERN: 'bedrock.pattern.js',
  PATTERN_META: 'bedrock.pattern-meta.json',
  CONFIG: 'bedrock.config.js',
};

module.exports = {
  USER_SITE_PUBLIC: '/user-site-public',
  TOKEN_CATS,
  TOKEN_GROUPS,
  tokenGroups,
  BASE_PATHS,
  tokenCategoriesWithDemo,
  FILE_NAMES,
  TOKEN_FORMATS,
};
