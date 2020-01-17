/**
 * @type {import('@docusaurus/plugin-content-docs/src/types').Sidebar}
 */
const sidebarConfig = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      items: [
        {
          type: 'doc',
          id: 'intro',
        },
        {
          type: 'doc',
          id: 'getting-started',
        },
        {
          type: 'doc',
          id: 'installation',
        },
        {
          type: 'doc',
          id: 'config',
        },
        {
          type: 'doc',
          id: 'glossary',
        },
        {
          type: 'doc',
          id: 'what-is-knapsack',
        },
        {
          type: 'doc',
          id: 'file-structure',
        },
        {
          type: 'doc',
          id: 'getting-help',
        },
      ],
    },
    {
      type: 'category',
      label: 'Basic Tutorial',
      items: [
        {
          type: 'doc',
          id: 'basic-tutorial--intro',
        },
      ],
    },
    {
      type: 'category',
      label: 'Advanced Tutorial',
      items: [
        {
          type: 'doc',
          id: 'advanced-tutorial--intro',
        },
      ],
    },
    {
      type: 'category',
      label: 'Main Concepts',
      items: [
        {
          type: 'doc',
          id: 'design-tokens',
        },
        {
          type: 'category',
          label: 'Patterns',
          items: [
            {
              type: 'doc',
              id: 'patterns-overview',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        {
          type: 'doc',
          id: 'add-new-pattern',
        },
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: [
        {
          type: 'doc',
          id: 'troubleshooting',
        },
      ],
    },

    // 'Getting Started': [
    //   'intro',
    //   'getting-started',
    //   'dashboard-settings',
    //   'data',
    // ],
    // Patterns: [
    //   'patterns-overview',
    //   'add-new-pattern',
    //   'example-button',
    //   'example-nesting-patterns',
    //   'spec',
    // ],
    // 'Design Tokens': ['design-tokens'],
    // Demos: ['demos'],
    // Production: ['config', 'deployment'],
    {
      type: 'category',
      label: 'API Reference',
      items: [
        {
          type: 'doc',
          id: 'api--cli',
        },
      ],
    },
    {
      type: 'doc',
      id: 'faq',
    },
    // We have a simple "sidebar-more.json" so the CMS can easily add to it, since it can't handle the more complicated above structure
    // eslint-disable-next-line global-require
    // ...require('./sidebar-more.json'),
  ],
};

module.exports = sidebarConfig;
