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
          id: 'intro/overview',
        },
        {
          type: 'doc',
          id: 'intro/getting-started',
        },
        {
          type: 'doc',
          id: 'intro/installation',
        },
        {
          type: 'doc',
          id: 'intro/config',
        },
        {
          type: 'doc',
          id: 'intro/glossary',
        },
        {
          type: 'doc',
          id: 'intro/file-structure',
        },
        {
          type: 'doc',
          id: 'intro/getting-help',
        },
      ],
    },
    {
      type: 'category',
      label: 'Basic Tutorial',
      items: [
        {
          type: 'doc',
          id: 'basic-tutorial/intro',
        },
        {
          type: 'doc',
          id: 'basic-tutorial/setting-up-button',
        },
      ],
    },
    {
      type: 'category',
      label: 'Advanced Tutorial',
      items: [
        {
          type: 'doc',
          id: 'advanced-tutorial/intro',
        },
      ],
    },
    {
      type: 'category',
      label: 'Main Concepts',
      items: [
        {
          type: 'doc',
          id: 'main-concepts/design-tokens',
        },
        {
          type: 'category',
          label: 'Patterns',
          items: [
            {
              type: 'doc',
              id: 'main-concepts/patterns/overview',
            },
            {
              type: 'doc',
              id: 'main-concepts/patterns/spec',
            },
            {
              type: 'doc',
              id: 'main-concepts/patterns/patterns-anatomy',
            },
          ],
        },
        {
          type: 'doc',
          id: 'main-concepts/data',
        },
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        {
          type: 'doc',
          id: 'guides/add-new-pattern',
        },
        {
          type: 'doc',
          id: 'guides/hosting',
        },
        {
          type: 'doc',
          id: 'guides/settings',
        },
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: [
        {
          type: 'doc',
          id: 'troubleshooting/general',
        },
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        {
          type: 'doc',
          id: 'api/cli',
        },
      ],
    },
    {
      type: 'category',
      label: 'Misc',
      items: [
        {
          type: 'doc',
          id: 'misc/faq',
        },
        {
          type: 'doc',
          id: 'misc/examples',
        },
      ],
    },
    // We have a simple "sidebar-more.json" so the CMS can easily add to it, since it can't handle the more complicated above structure
    // eslint-disable-next-line global-require
    // ...require('./sidebar-more.json'),
  ],
};

module.exports = sidebarConfig;
