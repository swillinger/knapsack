const TOKEN_CATS = {
  BOX_SHADOW: 'box-shadow',
  INNER_SHADOW: 'inner-shadow',
  TEXT_SHADOW: 'text-shadow',
  TEXT_COLOR: 'text-color',
  BACKGROUND_COLOR: 'background-color',
  BORDER_COLOR: 'border-color',
  BORDER_STYLE: 'border-style',
  BORDER_RADIUS: 'border-radius',
  FONT_FAMILY: 'font-family',
  FONT_SIZE: 'font-size',
  FONT_WEIGHT: 'font-weight',
  FONT_STYLE: 'font-style',
  LINE_HEIGHT: 'line-height',
  ANIMATION: 'animation',
  HR_COLOR: 'hr-color',
  BACKGROUND_GRADIENT: 'background-gradient',
  SPACING: 'spacing',
  MEDIA_QUERY: 'media-query',
};

/**
 * @todo ensure we have a demo for each of these
 * @type {string[]}
 * */
const tokenCategoriesWithDemo = Object.values(TOKEN_CATS);

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
      TOKEN_CATS.BORDER_COLOR,
      TOKEN_CATS.TEXT_COLOR,
      TOKEN_CATS.HR_COLOR,
      TOKEN_CATS.BACKGROUND_COLOR,
      TOKEN_CATS.BACKGROUND_GRADIENT,
    ],
  },
  // @todo review
  // ANIMATIONS: {
  //   id: 'animations',
  //   title: 'Animations',
  //   description: 'Some Animations',
  //   tokenCategoryIds: [TOKEN_CATS.ANIMATION],
  // },
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
      TOKEN_CATS.FONT_SIZE,
      TOKEN_CATS.SPACING,
      TOKEN_CATS.MEDIA_QUERY,
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
  EXAMPLES: '/examples',
};

module.exports = {
  USER_SITE_PUBLIC: '/user-site-public',
  TOKEN_CATS,
  TOKEN_GROUPS,
  tokenGroups,
  BASE_PATHS,
  tokenCategoriesWithDemo,
};
