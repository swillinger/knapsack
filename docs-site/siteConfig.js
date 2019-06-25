/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'I made Knapsack. You should use it!',
    byline: 'Evan Lovely, CTO of Basalt',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/docusaurus.svg'.
    image:
      'https://pbs.twimg.com/profile_images/918231371759235073/6rWsdLOc_400x400.jpg',
    pinned: false,
    id: 1,
  },
  {
    caption:
      '"Unlike many of the existing tools out there — Pattern Lab, Fractal, Storybook, etc — Knapsack has design system know-how baked into it’s DNA!"',
    byline: 'Salem Ghoweri, Lead Frontend Architect, Pegasystems',
    image: '/img/salemsquare.jpg',
    pinned: true,
    id: 2,
  },
  {
    caption:
      '"Knapsack fundamentally changes the way we think about building design systems."',
    byline: 'Christopher Bloom, Dir. of Engineering, Phase2',
    image: '/img/bloom.jpeg',
    pinned: true,
    id: 3,
  },
];

const siteConfig = {
  title: 'Knapsack', // Title for your website.
  tagline: 'By Basalt',
  url: 'https://basalt.io', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'knapsack',
  organizationName: 'basaltinc',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'getting-started', label: 'Getting Started' },
    // { doc: 'config', label: 'Config' },
    { page: 'config-schemas', label: 'Config Schemas' },
  ],

  disableHeaderTitle: true,
  docsSideNavCollapsible: false,
  editUrl: 'https://github.com/basaltinc/knapsack/blob/master/docs/',

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/knapsack.svg',
  footerIcon: 'img/favicon.ico',
  favicon: 'img/favicon.ico',

  /* Colors for website */
  colors: {
    primaryColor: 'rgb(19, 27, 37)',
    secondaryColor: 'rgb(0, 111, 182)',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Basalt`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/knapsack.png',
  twitterImage: 'img/knapsack.png',

  // Show documentation's last contributor's name.
  enableUpdateBy: true,

  // Show documentation's last update time.
  enableUpdateTime: true,

  twitter: true,

  // @todo enable Google Analytics. This id was the one used on `getbedrock.com` from the `bedrock-site` repo
  // gaTrackingId: 'UA-107417461-3',

  // Optionally customize the look and feel by following the DocSearch documentation: https://community.algolia.com/docsearch/styling.html
  // You can also check your configuration in our GitHub repo: https://github.com/algolia/docsearch-configs/blob/master/configs/knapsack.json - Please open a pull request if want to leverage your configuration!
  algolia: {
    apiKey: 'e6d6b6095afc5fc4db6a10647a23fa3f',
    indexName: 'knapsack',
    algoliaOptions: {}, // Optional, if provided by Algolia
  },

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/basaltinc/knapsack',
};

module.exports = siteConfig;
