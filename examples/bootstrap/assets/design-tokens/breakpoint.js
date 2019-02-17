module.exports = {
  breakpoint: {
    width: {
      medium: {
        value: '480px',
      },
      large: {
        value: '768px',
      },
      xlarge: {
        value: '992px',
      },
      xxlarge: {
        value: '1200px',
      },
      xxxlarge: {
        value: '1400px',
      },
    },
    'media-query': {
      medium: {
        value: 'screen and (min-width: {breakpoint.width.medium.value})',
      },
      large: {
        value: 'screen and (min-width: {breakpoint.width.large.value})',
      },
      xlarge: {
        value: 'screen and (min-width: {breakpoint.width.xlarge.value})',
      },
      xxlarge: {
        value: 'screen and (min-width: {breakpoint.width.xxlarge.value})',
      },
      xxxlarge: {
        value: 'screen and (min-width: {breakpoint.width.xxxlarge.value})',
      },
    },
  },
};
