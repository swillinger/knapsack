const { join } = require('path');
const TwigRenderer = require('@basalt/twig-renderer');
const { getExample, getExamples, getSpacings, setExample } = require('./data');

const twigRenderer = new TwigRenderer({
  relativeFrom: __dirname,
  src: {
    roots: ['./patterns'],
    namespaces: [
      {
        id: 'patterns',
        recursive: true,
        paths: ['./patterns'],
      },
    ],
  },
  keepAlive: false,
});

const paths = {
  patterns: [join(__dirname, 'patterns/*')],
  newPatternDir: join(__dirname, 'patterns'),
  assetDir: join(__dirname, 'css'),
  assets: {
    css: [join(__dirname, 'css/simple.css')],
  },
};

const designTokens = [
  {
    id: 'spacings',
    meta: {
      title: 'Spacings',
      description:
        'Visual spacing is key to creating a clean and usable interface. Correctly implemented – visual spacing provides elements with the ability to "breath" by intentionally emphasizing white space.',
    },
    get: getSpacings,
  },
];

module.exports = {
  twigRenderer,
  paths,
  designTokens,
  getExample,
  getExamples,
  setExample,
};
