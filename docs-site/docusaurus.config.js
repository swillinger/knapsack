// See https://v2.docusaurus.io/docs/site-config for all the possible
// site configuration options.

const navLinks = [
  { to: 'docs/intro', label: 'Docs', position: 'right' },
  { to: 'config-schemas', label: 'Config Files', position: 'right' },
];

// Will be passed to @docusaurus/plugin-content-pages ~ https://v2.docusaurus.io/docs/using-plugins#docusaurusplugin-content-pages
/** @type {import('@docusaurus/plugin-content-pages/src/types').PluginOptions} */
const pagesConfig = {
  path: 'src/pages',
  routeBasePath: '',
  include: ['**/*.js', '**/*.jsx'],
};

/** @type {import('@docusaurus/plugin-content-docs/src/types').PluginOptions} */
const docsConfig = {
  // docs folder path relative to website dir.
  path: '../docs',
  // sidebars file relative to website dir.
  sidebarPath: require.resolve('./sidebar.json'),
  editUrl: 'https://github.com/basaltinc/knapsack/blob/next/docs-site/',
  include: ['**/*.md', '**/*.mdx'],
  routeBasePath: 'docs',
};

/**
 * @type {{ href?: string, label?: string, to?: string, html?: string }[]}
 * see "node_modules/@docusaurus/theme-classic/src/theme/Footer/index.js"
 * */
const footerLinks1 = [
  {
    href: 'https://demo-bootstrap.knapsack.basalt.io',
    label: 'Knaspack Bootstrap Example Site',
  },
  {
    href: 'https://github.com/basaltinc/knapsack',
    label: 'GitHub repo',
  },
  {
    href: 'https://basalt.io',
    label: 'Basalt',
  },
  {
    // edit config for CMS here: https://github.com/basaltinc/knapsack-site-cms/blob/master/config.yml
    href: 'https://knapsack-site-cms.netlify.com',
    label: 'Docs Site CMS',
  },
];

/** @type {import('@docusaurus/types').DocusaurusConfig} */
const siteConfig = {
  title: 'Knapsack', // Title for your website.
  url: 'https://knapsack.basalt.io',
  tagline: 'By Basalt',
  baseUrl: '/', // Base URL for your project */
  favicon: 'assets/favicon.ico',
  customFields: {
    foo: 'bar',
  },
  themeConfig: {
    navbar: {
      title: 'Knapsack',
      logo: {
        alt: 'Knapsack',
        src: '/img/knapsack-icon.png',
      },
      links: navLinks,
    },
    footer: {
      logo: {
        alt: 'Facebook Open Source Logo',
        src: 'https://docusaurus.io/img/oss_logo.png',
        href: 'https://opensource.facebook.com/',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Basalt`,
      links: [
        {
          title: 'Helpful Links',
          items: footerLinks1,
        },
      ],
    },
    image: 'assets/docusaurus.png',
    sidebarCollapsible: false,
    ogImage: 'assets/knapsack.png',
    twitterImage: 'assets/knapsack.png',
    footerIcon: 'assets/favicon.ico',
    // Optionally customize the look and feel by following the DocSearch documentation: https://community.algolia.com/docsearch/styling.html
    // You can also check your configuration in our GitHub repo: https://github.com/algolia/docsearch-configs/blob/master/configs/knapsack.json - Please open a pull request if want to leverage your configuration!
    algolia: {
      apiKey: 'e6d6b6095afc5fc4db6a10647a23fa3f',
      indexName: 'knapsack',
      algoliaOptions: {}, // Optional, if provided by Algolia
    },
    disableDarkMode: true,
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        // Will be passed to @docusaurus/plugin-content-docs ~ https://v2.docusaurus.io/docs/using-plugins#docusaurusplugin-content-docs
        docs: docsConfig,

        // Will be passed to @docusaurus/theme-classic.
        theme: {
          customCss: require.resolve('./ks-docs-site.css'),
        },

        // Will be passed to @docusaurus/plugin-content-blog ~ https://v2.docusaurus.io/docs/using-plugins#docusaurusplugin-content-blog
        // blog: {
        //   /**
        //    * Path to data on filesystem
        //    * relative to site dir
        //    */
        //   path: 'blog',
        //   /**
        //    * URL route for the blog section of your site
        //    * do not include trailing slash
        //    */
        //   routeBasePath: 'blog',
        //   include: ['*.md', '*.mdx'],
        //   postsPerPage: 10,
        //   /**
        //    * Theme components used by the blog pages
        //    */
        //   blogListComponent: '@theme/BlogListPage',
        //   blogPostComponent: '@theme/BlogPostPage',
        //   blogTagsListComponent: '@theme/BlogTagsListPage',
        //   blogTagsPostsComponent: '@theme/BlogTagsPostsPage',
        //   /**
        //    * Remark and Rehype plugins passed to MDX
        //    */
        //   remarkPlugins: [],
        //   rehypePlugins: [],
        //   /**
        //    * Truncate marker, can be a regex or string.
        //    */
        //   truncateMarker: /<!--\s*(truncate)\s*-->/,
        //   /**
        //    * Blog feed
        //    * If feedOptions is undefined, no rss feed will be generated
        //    */
        //   feedOptions: {
        //     type: '', // required. 'rss' | 'feed' | 'all'
        //     title: '', // default to siteConfig.title
        //     description: '', // default to  `${siteConfig.title} Blog`
        //     copyright: '',
        //     language: undefined, // possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        //   },
        // },

        // Will be passed to @docusaurus/plugin-content-pages ~ https://v2.docusaurus.io/docs/using-plugins#docusaurusplugin-content-pages
        pages: pagesConfig,

        // Will be passed to @docusaurus/plugin-content-sitemap ~ https://v2.docusaurus.io/docs/using-plugins#docusaurusplugin-sitemap
        sitemap: {},
      },
    ],
  ],
};

module.exports = siteConfig;
