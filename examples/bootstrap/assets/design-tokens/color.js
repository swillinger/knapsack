// Core Color Values
const neutral = {
  black: {
    base: {
      value: '#222222',
      comment: 'Primary text color',
    },
    '35': {
      value: 'rgba(0, 0, 0, 0.35)',
      comment: 'To be used for button backgrounds',
      tags: ['opacity'],
    },
    '55': {
      value: 'rgba(0, 0, 0, 0.55)',
      comment: 'To be used for button backgrounds on hover',
      tags: ['opacity'],
    },
  },
  darkest: {
    value: '#454341',
    comment: 'Secondary text color',
  },
  dark: {
    value: '#737373',
    comment: 'Secondary text color',
  },
  medium: {
    value: '#C0C0BD',
    comment: 'Neutral or inactive states',
  },
  light: {
    value: '#E9E9E4',
  },
  lightest: {
    value: '#F6F6F4',
    comment: 'Background color on content cards',
  },
  white: {
    value: '#FFFFFF',
    comment: 'Background color, Text over images and solid colors',
  },
};
const blue = {
  primary: {
    base: {
      value: '#1C73CA',
    },
    shadow: {
      value: '#064785',
    },
    accent: {
      value: '#4DA4FA',
    },
    highlight: {
      value: '#F7FBFF',
    },
    light: {
      value: '#D4E7FA',
    },
    overlay: {
      value: 'rgba(28, 115, 202, 0.85)',
    },
  },
  secondary: {
    base: {
      value: '#38657F',
    },
    shadow: {
      value: '#1F3C4C',
    },
    accent: {
      value: '#4F86A6',
    },
    highlight: {
      value: '#DDF0FC',
    },
  },
  tertiary: {
    base: {
      value: '#017AAC',
      comment: 'Used in the Adult segment context',
    },
    shadow: {
      value: '#014867',
      comment: 'Used in the Adult segment context',
    },
    accent: {
      value: '#03AEDF',
      comment: 'Used in the Adult segment context',
    },
    highlight: {
      value: '#F4FCFF',
      comment: 'Used in the Adult segment context',
    },
    overlay: {
      value: 'rgba(1, 122, 172, 0.85)',
      comment: 'Used in the Adult segment context',
    },
  },
};
const maroon = {
  base: {
    value: '#A82054',
    comment: 'Used in the Adult segment context',
  },
  shadow: {
    value: '#5F1330',
    comment: 'Used in the Adult segment context',
  },
  accent: {
    value: '#E92B74',
    comment: 'Used in the Adult segment context',
  },
  highlight: {
    value: '#FFF5F5',
    comment: 'Used in the Adult segment context',
  },
  overlay: {
    value: 'rgba(168, 32, 84, 0.85)',
    comment: 'Used in the Adult segment context',
  },
};
const teal = {
  base: {
    value: '#00837B',
    comment: 'Used in the HP segment context',
  },
  shadow: {
    value: '#00514B',
    comment: 'Used in the HP segment context',
  },
  accent: {
    value: '#00A59B',
    comment: 'Used in the HP segment context',
  },
  highlight: {
    value: '#F0FFFD',
    comment: 'Used in the HP segment context',
  },
  overlay: {
    value: 'rgba(0, 131, 123, 0.85)',
    comment: 'Used in the HP segment context',
  },
};
const orange = {
  base: {
    value: '#C84E23',
    comment: 'Used in the RS segment context',
  },
  shadow: {
    value: '#7A1F00',
    comment: 'Used in the RS segment context',
  },
  accent: {
    value: '#F26529',
    comment: 'Used in the RS segment context',
  },
  highlight: {
    value: '#FFF9F0',
    comment: 'Used in the RS segment context',
  },
  overlay: {
    value: 'rgba(200, 78, 35, 0.85)',
    comment: 'Used in the RS segment context',
  },
};

// Brand Color Mappings/Theme implementations
const msk = {
  primary: {
    base: {
      value: '{color.core.blue.primary.base.value}',
      comment: 'Primary Brand Color, Buttons, Links, Solid Backgrounds',
    },
    shadow: {
      value: '{color.core.blue.primary.shadow.value}',
      comment: 'Hovers, Illustration shadows',
    },
    accent: {
      value: '{color.core.blue.primary.accent.value}',
      comment: 'Eyebrows, Divider line, Used sparingly as an accent color',
    },
    highlight: {
      value: '{color.core.blue.primary.highlight.value}',
      comment: 'Backgrounds, Hovers, Illustrations highlights',
    },
    light: {
      value: '{color.core.blue.primary.light.value}',
      comment: 'Publication widget, Not for text backgrounds',
    },
    overlay: {
      value: '{color.core.blue.primary.overlay.value}',
      comment: 'To be used on overlays',
    },
  },
  secondary: {
    base: {
      value: '{color.core.blue.secondary.base.value}',
      comment: 'Secondary brand color',
    },
    shadow: {
      value: '{color.core.blue.secondary.shadow.value}',
      comment: 'Hover, Illustration shadows',
    },
    accent: {
      value: '{color.core.blue.secondary.accent.value}',
      comment: 'Eyebrows, Divider Lines, Used sparingly as an accent color',
    },
    highlight: {
      value: '{color.core.blue.secondary.highlight.value}',
      comment: 'Background, Hovers, Illustration highlights',
    },
  },
};
const adult = {
  base: {
    value: '{color.core.blue.tertiary.base.value}',
    comment: 'Primary segment color, Used to reinforce way-finding',
    tags: ['segment'],
  },
  shadow: {
    value: '{color.core.blue.tertiary.shadow.value}',
    comment: 'Hovers, Illustration shadows',
    tags: ['segment'],
  },
  accent: {
    value: '{color.core.blue.tertiary.accent.value}',
    comment: 'Eyebrows, Divider lines, Used sparingly as an accent color',
    tags: ['segment'],
  },
  highlight: {
    value: '{color.core.blue.tertiary.highlight.value}',
    comment: 'Backgrounds, Hovers, Illustration highlights',
    tags: ['segment'],
  },
  overlay: {
    value: '{color.core.blue.tertiary.overlay.value}',
    comment: 'To be used on overlays',
    tags: ['opacity'],
  },
};
const ct = {
  base: {
    value: '{color.core.maroon.base.value}',
    comment: 'Primary segment color, Used to reinforce way-finding',
    tags: ['segment'],
  },
  shadow: {
    value: '{color.core.maroon.shadow.value}',
    comment: 'Hovers, Illustration shadows',
    tags: ['segment'],
  },
  accent: {
    value: '{color.core.maroon.accent.value}',
    comment: 'Eyebrows, Divider lines, Used sparingly as an accent color',
    tags: ['segment'],
  },
  highlight: {
    value: '{color.core.maroon.highlight.value}',
    comment: 'Backgrounds, Hovers, Illustration highlights',
    tags: ['segment'],
  },
  overlay: {
    value: '{color.core.maroon.overlay.value}',
    comment: 'To be used on overlays',
    tags: ['opacity'],
  },
};
const hp = {
  base: {
    value: '{color.core.teal.base.value}',
    comment: 'Primary segment color, Used to reinforce way-finding',
    tags: ['segment'],
  },
  shadow: {
    value: '{color.core.teal.shadow.value}',
    comment: 'Hovers, Illustration shadows',
    tags: ['segment'],
  },
  accent: {
    value: '{color.core.teal.accent.value}',
    comment: 'Eyebrows, Divider lines, Used sparingly as an accent color',
    tags: ['segment'],
  },
  highlight: {
    value: '{color.core.teal.highlight.value}',
    comment: 'Backgrounds, Hovers, Illustration highlights',
    tags: ['segment'],
  },
  overlay: {
    value: '{color.core.teal.overlay.value}',
    comment: 'To be used on overlays',
    tags: ['opacity'],
  },
};
const rs = {
  base: {
    value: '{color.core.orange.base.value}',
    comment: 'Primary segment color, Used to reinforce way-finding',
    tags: ['segment'],
  },
  shadow: {
    value: '{color.core.orange.shadow.value}',
    comment: 'Hovers, Illustration shadows',
    tags: ['segment'],
  },
  accent: {
    value: '{color.core.orange.accent.value}',
    comment: 'Eyebrows, Divider lines, Used sparingly as an accent color',
    tags: ['segment'],
  },
  highlight: {
    value: '{color.core.orange.highlight.value}',
    comment: 'Backgrounds, Hovers, Illustration highlights',
    tags: ['segment'],
  },
  overlay: {
    value: '{color.core.orange.overlay.value}',
    comment: 'To be used on overlays',
    tags: ['opacity'],
  },
};
const gsk = {
  primary: {
    base: {
      value: '{color.context.msk.primary.base.value}',
      comment: 'Primary Brand Color, Buttons, Links, Solid Backgrounds',
    },
    shadow: {
      value: '{color.context.msk.primary.shadow.value}',
      comment: 'Hover, Illustration shadows',
    },
    accent: {
      value: '{color.context.msk.primary.accent.value}',
      comment: 'Eyebrows, Divider Lines, Used sparingly as an accent color',
    },
    highlight: {
      value: '{color.context.msk.primary.highlight.value}',
      comment: 'Background, Hovers, Illustration highlights',
    },
  },
  secondary: {
    base: {
      value: '{color.core.orange.base.value}',
      comment: 'Primary Segment Color, Used to reinforce way-finding',
    },
    shadow: {
      value: '{color.core.orange.shadow.value}',
      comment: 'Hover, Illustration shadows',
    },
    accent: {
      value: '{color.core.orange.accent.value}',
      comment: 'Eyebrows, Divider Lines, Used sparingly as an accent color',
    },
    highlight: {
      value: '{color.core.orange.highlight.value}',
      comment: 'Background, Hovers, Illustration highlights',
    },
  },
};
const mslf = {
  adult: {
    value: '{color.context.adult.base.value}',
  },
  ct: {
    value: '{color.context.ct.base.value}',
  },
  hp: {
    value: '{color.context.hp.base.value}',
  },
  rs: {
    value: '{color.context.rs.base.value}',
  },
};

// Utility Colors
const utility = {
  success: {
    dark: {
      value: '#325E1C',
      comment: 'Used for successful messaging text',
    },
    base: {
      value: '#009900',
      comment: 'Used for feedback on successful actions',
    },
    light: {
      value: '#DFF8DF',
      comment: 'Used for feedback on successful actions background',
    },
  },
  error: {
    base: {
      value: '#E62600',
      comment: 'Used for error text',
    },
    dark: {
      value: '#A51B00',
      comment: 'Used to show an error',
    },
    light: {
      value: '#FCF4F2',
      comment: 'Used for error message background',
    },
  },
  warning: {
    dark: {
      value: '#BB7600',
      comment: 'Used for warning text',
    },
    base: {
      value: '#FFB326',
      comment: 'Used to show a warning',
    },
    light: {
      value: '#FEF6E4',
      comment: 'Used for warning message background',
    },
  },
};
const social = {
  facebook: {
    base: {
      value: '#37619E',
      comment: 'Used for Facebook, if not gray',
    },
    hover: {
      value: '#1D3352',
      comment: 'Used for Facebook hover, if not gray',
    },
  },
  linkedin: {
    base: {
      value: '#155069',
      comment: 'Used for Linkedin, if not gray',
    },
    hover: {
      value: '#0B3043',
      comment: 'Used for Linkedin Hover, if not gray',
    },
  },
  twitter: {
    base: {
      value: '#196E9B',
      comment: 'Used for Twitter, if not gray',
    },
    hover: {
      value: '#155069',
      comment: 'Used for Twitter hover, if not gray',
    },
  },
};

module.exports = {
  color: {
    // Core color values,
    core: {
      neutral,
      blue,
      maroon,
      teal,
      orange,
    },

    // Theme, brand, and segment implementations
    context: {
      msk,
      adult,
      ct,
      hp,
      rs,
      gsk,
      mslf,
    },

    // Utitlity
    utility,
    social,
  },
};
