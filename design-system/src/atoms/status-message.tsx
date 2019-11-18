import React from 'react';
import './status-message.scss';

type StatusTypes = 'success' | 'info' | 'warning' | 'error';
type Props = {
  message: string;
  type?: StatusTypes;
};

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

export const StatusMessage: React.FC<Props> = ({
  message,
  type = 'info',
}: Props) => {
  const theType = statusTypes.includes(type) ? type : 'info';
  return (
    <aside
      className="ks-status-message"
      style={{
        border: `2px solid ${statusColorSets[theType].border}`,
        backgroundColor: statusColorSets[theType].bg,
        color: statusColorSets[theType].text,
      }}
    >
      {message}
    </aside>
  );
};
