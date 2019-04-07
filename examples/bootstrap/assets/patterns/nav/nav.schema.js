const bootstrapNavSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'nav',
  description: 'Indicate the current page’s location.',
  required: ['navItems'],
  properties: {
    colorScheme: {
      type: 'string',
      title: 'Color Scheme',
      enum: ['light', 'dark'],
      enumNames: ['Light', 'Dark'],
      default: 'light',
    },
    brand: {
      type: 'object',
      title: 'Brand Info',
      properties: {
        brandImg: {
            title: 'Brand Logo',
            type: 'string',
        },
        brandName: {
            title: 'Brand Name',
            type: 'string',
        },
      },
    },
    nav: {
      type: 'object',
      title: 'Nav',
      properties: {
        type: {
          title: 'Nav Type',
          type: 'string',
          enum: ['default', 'tabs', 'pills'],
          enumNames: ['Default', 'Tabs', 'Pills'],
          default: 'default',
        },
        navItems: {
          type: 'array',
          title: 'Nav Items',
          items: {
            type: 'object',
            title: 'Item',
            required: ['text', 'link'],
            properties: {
              text: {
                type: 'string',
                title: 'Item Text',
              },
              link: {
                type: 'string',
                title: 'Item Link',
              },
              active: {
                type: 'boolean',
                title: 'Active',
                default: false,
              },
            },
          },
        },
      },
    },
  },
  examples: [
    {
      colorScheme: 'dark',
      brand: {
        brandImg: '/images/knapsack_logo.png',
        brandName: 'MyBrand',
      },
      nav: {
        navItems: [
          {
            text: 'Home',
            link: '#',
            active: true,
          },
          {
            text: 'Library',
            link: '#',
          },
          {
            text: 'Data',
            link: '#',
          },
        ],
      },
    },
  ],
};

const materialNavSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'nav',
  description: 'Indicate the current page’s location.',
  required: [],
  properties: {
    logo: {
      type: 'string',
      title: 'Logo'
    },
    title: {
      type: 'string',
      title: 'Title',
    },
    type: {
      title: 'Nav Type',
      type: 'string',
      enum: ['standard', 'short', 'prominent', 'short-collapsed'],
      enumNames: ['Standard', 'Short', 'Prominent', 'Short Collapsed'],
      default: 'standard',
    },
    download: {
      type: 'boolean',
      title: 'Download Icon',
    },
    print: {
      type: 'boolean',
      title: 'Print Icon',
    },
    bookmark: {
      type: 'boolean',
      title: 'Bookmark Icon',
    },
  },
  examples: [
    {
      logo: '/images/knapsack_logo.png',
      title: 'Knapsack',
      download: true,
      print: true,
      bookmark: true,
    },
  ],
};

module.exports = {
  bootstrapNavSchema,
  materialNavSchema,
};
