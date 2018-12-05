import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// @todo pull into Bedrock theming vars
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

const StatusMessageWrapper = styled.aside`
  padding: ${({ theme }) =>
    `${theme.globals.spacing.s} ${theme.globals.spacing.m} ${
      theme.globals.spacing.xs
    }`};
  margin-bottom: ${({ theme }) => theme.globals.spacing.l};
  border: solid 2px ${({ type }) => statusColorSets[type].border};
  background-color: ${({ type }) => statusColorSets[type].bg};
  color: ${({ type }) => statusColorSets[type].text};
  line-height: 1;
`;

export function StatusMessage(props) {
  return (
    <StatusMessageWrapper type={props.type.trim()}>
      {props.message}
    </StatusMessageWrapper>
  );
}

StatusMessage.defaultProps = {
  type: 'info',
};

StatusMessage.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
};
