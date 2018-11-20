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

module.exports = {
  TOKEN_CATS,
  tokenCategoriesWithDemo,
};
