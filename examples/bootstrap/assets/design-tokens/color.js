// Core Color Values
const grayscale = {
  white: { value: '#fff' },
  gray100: { value: '#f8f9fa' },
  gray200: { value: '#e9ecef' },
  gray300: { value: '#dee2e6' },
  gray400: { value: '#ced4da' },
  gray500: { value: '#adb5bd' },
  gray600: { value: '#6c757d' },
  gray700: { value: '#495057' },
  gray800: { value: '#343a40' },
  gray900: { value: '#212529' },
  black: { value: '#000' },
};

const core = {
  blue:    { value: '#007bff' },
  indigo:  { value: '#6610f2' },
  purple:  { value: '#6f42c1' },
  pink:    { value: '#e83e8c' },
  red:     { value: '#dc3545' },
  orange:  { value: '#fd7e14' },
  yellow:  { value: '#ffc107' },
  green:   { value: '#28a745' },
  teal:    { value: '#20c997' },
  cyan:    { value: '#17a2b8' },
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

module.exports = {
  color: {
    grayscale,
    core,
    message,
  },
};
