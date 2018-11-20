const {
  TOKEN_CATS,
  tokenCategoriesWithDemo,
} = require('@basalt/bedrock-design-token-demos/constants');

const TOKEN_GROUPS = {
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
  BORDERS: {
    id: 'borders',
    title: 'Borders',
    description: 'Some borders',
    tokenCategoryIds: [
      TOKEN_CATS.BORDER_COLOR,
      TOKEN_CATS.BORDER_STYLE,
      TOKEN_CATS.BORDER_RADIUS,
    ],
  },
  COLORS: {
    id: 'colors',
    title: 'Colors',
    description: 'Some colors',
    tokenCategoryIds: [
      TOKEN_CATS.BACKGROUND_COLOR,
      TOKEN_CATS.BORDER_COLOR,
      TOKEN_CATS.TEXT_COLOR,
      TOKEN_CATS.HR_COLOR,
    ],
  },
  // @todo review
  ANIMATIONS: {
    id: 'animations',
    title: 'Animations',
    description: 'Some Animations',
    tokenCategoryIds: [TOKEN_CATS.ANIMATION],
  },
  TYPOGRAPHY: {
    id: 'typography',
    title: 'Typography',
    description: 'Some typography',
    tokenCategoryIds: [
      TOKEN_CATS.FONT_FAMILY,
      TOKEN_CATS.FONT_SIZE,
      TOKEN_CATS.FONT_STYLE,
      TOKEN_CATS.FONT_WEIGHT,
      TOKEN_CATS.LINE_HEIGHT,
      TOKEN_CATS.TEXT_COLOR,
      TOKEN_CATS.TEXT_SHADOW,
    ],
  },
  SIZING: {
    id: 'sizing',
    title: 'Sizing',
    description: 'Some sizing',
    tokenCategoryIds: [
      TOKEN_CATS.SPACING,
      TOKEN_CATS.MEDIA_QUERY,
      TOKEN_CATS.FONT_SIZE,
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

module.exports = {
  USER_SITE_PUBLIC: '/user-site-public',
  TOKEN_CATS,
  TOKEN_GROUPS,
  tokenGroups,
  BASE_PATHS,
  tokenCategoriesWithDemo,
};
