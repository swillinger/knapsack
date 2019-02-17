module.exports = {
  shadow: {
    text: {
      medium: {
        value: '0 1px 2px rgba(0,0,0,0.5)',
      },
    },
    box: {
      hard: {
        value: '0 2px 1px {color.core.neutral.medium.value}',
      },
      soft: {
        value: '0 2px 10px {color.core.neutral.black.35.value}',
      },
      inner: {
        value: 'inset 0 1px 2px 0 rgba(34,34,34,25)',
        comment: 'Intended for use in forms',
      },
    },
  },
};
