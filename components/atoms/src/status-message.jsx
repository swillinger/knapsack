import React from 'react';
import PropTypes from 'prop-types';
import './status-message.scss';

const statusTypes = ['success', 'info', 'warning', 'error'];
const statusColorSets = {
  info: {
    text: '#004085',
    bg: '#cce5ff',
    border: '#b8daff',
  },
  success: {
    text: '#155724',
    bg: '#d4edda',
    border: '#c3e6cb',
  },
  warning: {
    text: '#bd9712',
    bg: '#fff3cd',
    border: '#ffeeba',
  },
  error: {
    text: '#721c24',
    bg: '#f8d7da',
    border: '#f5c6cb',
  },
};

export function StatusMessage(props) {
  const type = statusTypes.includes(props.type) ? props.type : 'info';
  return (
    <aside
      className="k-status-message"
      type={type}
      style={{
        border: `2px solid ${statusColorSets[type].border}`,
        backgroundColor: statusColorSets[type].bg,
        color: statusColorSets[type].text,
      }}
    >
      {props.message}
    </aside>
  );
}

StatusMessage.defaultProps = {
  type: 'info',
};

StatusMessage.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
};
