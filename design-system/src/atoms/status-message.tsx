import React from 'react';
import marked from 'marked';
import { KsButton } from './button';
import './status-message.scss';

type StatusTypes = 'success' | 'info' | 'warning' | 'error';
type Props = {
  message: string;
  type?: StatusTypes;
  handleClose?: () => void;
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
  handleClose,
}: Props) => {
  const theType = statusTypes.includes(type) ? type : 'info';
  const html = marked.parse(message);
  return (
    <div
      className="ks-status-message"
      style={{
        border: `2px solid ${statusColorSets[theType].border}`,
        backgroundColor: statusColorSets[theType].bg,
        color: statusColorSets[theType].text,
      }}
    >
      {handleClose && (
        <KsButton
          className="ks-status-message__close"
          kind="icon"
          flush
          handleTrigger={handleClose}
          icon="close"
        />
      )}
      <div
        className="ks-status-message__content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
