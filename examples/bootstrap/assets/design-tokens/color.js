// Core Color Values
const grayscale = {

'white':    {
  value: '#fff',
},
'gray100': {
  value: '#f8f9fa',
},
'gray200': {
  value: '#e9ecef',
},
'gray300': {
  value: '#dee2e6',
},
'gray400': {
  value: '#ced4da',
},
'gray500': {
  value: '#adb5bd',
},
'gray600': {
  value: '#6c757d',
},
'gray700': {
  value: '#495057',
},
'gray800': {
  value: '#343a40',
},
'gray900': {
  value: '#212529',
},
'black':    {
  value: '#000',
},

};

const core = {
  blue:    { value: '#007bff'},
  indigo:  { value: '#6610f2'},
  purple:  { value: '#6f42c1'},
  pink:    { value: '#e83e8c'},
  red:     { value: '#dc3545'},
  orange:  { value: '#fd7e14'},
  yellow:  { value: '#ffc107'},
  green:   { value: '#28a745'},
  teal:    { value: '#20c997'},
  cyan:    { value: '#17a2b8'},
};

const message = {
  primary:       { value: '{color.core.blue.value}' },
  secondary:     { value: '{color.grayscale.gray600.value}' },
  success:       { value: '{color.core.green.value}' },
  info:          { value: '{color.core.cyan.value}' },
  warning:       { value: '{color.core.yellow.value}' },
  danger:        { value: '{color.core.red.value}' },
  light:         { value: '{color.grayscale.gray100.value}' },
  dark:          { value: '{color.grayscale.gray800.value}' },
};

// // Utility Colors
// const utility = {
//   success: {
//     dark: {
//       value: '#325E1C',
//       comment: 'Used for successful messaging text',
//     },
//     base: {
//       value: '#009900',
//       comment: 'Used for feedback on successful actions',
//     },
//     light: {
//       value: '#DFF8DF',
//       comment: 'Used for feedback on successful actions background',
//     },
//   },
//   error: {
//     base: {
//       value: '#E62600',
//       comment: 'Used for error text',
//     },
//     dark: {
//       value: '#A51B00',
//       comment: 'Used to show an error',
//     },
//     light: {
//       value: '#FCF4F2',
//       comment: 'Used for error message background',
//     },
//   },
//   warning: {
//     dark: {
//       value: '#BB7600',
//       comment: 'Used for warning text',
//     },
//     base: {
//       value: '#FFB326',
//       comment: 'Used to show a warning',
//     },
//     light: {
//       value: '#FEF6E4',
//       comment: 'Used for warning message background',
//     },
//   },
// };
// const social = {
//   facebook: {
//     base: {
//       value: '#37619E',
//       comment: 'Used for Facebook, if not gray',
//     },
//     hover: {
//       value: '#1D3352',
//       comment: 'Used for Facebook hover, if not gray',
//     },
//   },
//   linkedin: {
//     base: {
//       value: '#155069',
//       comment: 'Used for Linkedin, if not gray',
//     },
//     hover: {
//       value: '#0B3043',
//       comment: 'Used for Linkedin Hover, if not gray',
//     },
//   },
//   twitter: {
//     base: {
//       value: '#196E9B',
//       comment: 'Used for Twitter, if not gray',
//     },
//     hover: {
//       value: '#155069',
//       comment: 'Used for Twitter hover, if not gray',
//     },
//   },
// };

module.exports = {
  color: {
    grayscale,
    core,
    message,
  },
};
