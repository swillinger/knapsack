const TOKEN_CATS = {
  RAW_VALUES: 'raw-values',
  TABLE_LIST: 'table-list',
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
  // BACKGROUND_GRADIENT: 'background-gradient',
  SPACING: 'spacing',
  MEDIA_QUERY: 'media-query',
};

/**
 * @todo ensure we have a demo for each of these
 * @todo make a GraphQL `enum` out of this
 * @type {string[]}
 * */
const tokenCategoriesWithDemo = Object.values(TOKEN_CATS);

// @todo make a GraphQL `enum` out of this
const TOKEN_FORMATS = {
  CUSTOM_PROPERTIES_CSS: 'custom-properties.css',
  CSSMODULES_CSS: 'cssmodules.css',
  SCSS: 'scss',
  DEFAULT_SCSS: 'default.scss',
  MAP_SCSS: 'map.scss',
  MAP_VARIABLES_SCSS: 'map.variables.scss',
  LIST_SCSS: 'list.scss',
  COMMON_JS: 'common.js',
  MODULE_JS: 'module.js',
  ANDROID_XML: 'android.xml',
  IOS_JSON: 'ios.json',
  LESS: 'less',
  RAW_JSON: 'raw.json',
  STYL: 'styl',
  AURA_TOKENS: 'aura.tokens',
  JSON: 'json',
  DEFAULT_SASS: 'default.sass',
  SASS: 'sass',
};

module.exports = {
  TOKEN_CATS,
  TOKEN_FORMATS,
  tokenCategoriesWithDemo,
};
