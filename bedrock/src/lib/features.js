const isProd = process.env.NODE_ENV === 'production';

// do not import this from within the `client/` folder - it's available via `context.features` using React Context
module.exports = {
  enableBlockquotes: false,
  enableUiSettings: true, // @todo disable UI settings again soon; normally it's `!isProd` turning, but I'm turning it on for staging sites so we can show off Bedrock editing for awhile
  // @todo fix ability to create new patterns via UI
  enableUiCreatePattern: false,
  enableTemplatePush: !isProd,
  // @todo enablePatternIcons is not support in pattern-grid.jsx and playground-sidebar--pattern-list-item as of adoption of gql over REST API
  enablePatternIcons: false,
  enableCodeBlockLiveEdit: false,
};
