module.exports = {
  docs: {
    'Getting Started': [
      'intro',
      'getting-started',
      'dashboard-settings',
      'data',
    ],
    Patterns: [
      'patterns-overview',
      'add-new-pattern',
      'example-button',
      'example-nesting-patterns',
      'spec',
    ],
    'Page Builder': ['page-builder'],
    'Design Tokens': ['design-tokens'],
    Demos: ['demos'],
    Production: ['config', 'deployment'],
    // We have a simple "sidebar-more.json" so the CMS can easily add to it, since it can't handle the more complicated above structure
    // eslint-disable-next-line global-require
    ...require('./sidebar-more.json'),
  },
};
