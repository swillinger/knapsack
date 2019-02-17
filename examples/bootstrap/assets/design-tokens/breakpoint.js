module.exports = {
  breakpoint: {
    width: {
      sm: {
        value: '576px',
      },
      md: {
        value: '768px',
      },
      lg: {
        value: '992px',
      },
      xl: {
        value: '1200px',
      },
    },
    'media-query': {
      sm: {
        value: 'screen and (min-width: {breakpoint.width.sm.value})',
      },
      md: {
        value: 'screen and (min-width: {breakpoint.width.md.value})',
      },
      lg: {
        value: 'screen and (min-width: {breakpoint.width.lg.value})',
      },
      xl: {
        value: 'screen and (min-width: {breakpoint.width.xl.value})',
      },
    },
  },
};
