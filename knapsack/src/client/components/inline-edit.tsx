import React, { useState, useRef } from 'react';
import { KsButton } from '@knapsack/design-system';
import cn from 'classnames';
import './inline-edit.scss';
import { useSelector } from '../store';

type TextProps = {
  text: string;
  isHeading?: boolean;
  showControls?: boolean;
  handleSave: (text: string) => void;
  canEdit: boolean;
};

export const InlineEditTextBase: React.FC<TextProps> = ({
  text,
  isHeading,
  showControls = false,
  handleSave,
  canEdit,
}: TextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const textEl = useRef<HTMLSpanElement>();

  if (!canEdit) {
    return <span>{text}</span>;
  }

  const handleTargetFocus = () => {
    if (isEditing) {
      setIsEditing(false);
      textEl.current.textContent = text;
      // de-select text
      setTimeout(() => {
        window.getSelection().removeAllRanges();
      }, 0);
    } else {
      setIsEditing(true);
      // select text
      setTimeout(() => {
        textEl.current.focus();
        const range = document.createRange();
        range.selectNodeContents(textEl.current);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }, 0);
    }
  };

  const handleControlTrigger = () => {
    if (isEditing) {
      handleSave(textEl.current.textContent);
    }
    handleTargetFocus();
  };

  const classes = cn({
    'ks-inline-edit': true,
    'ks-inline-edit--visible': showControls,
    'ks-inline-edit--editing': isEditing,
  });

  const btnState = isEditing ? 'save' : 'edit-text';

  return (
    <span className={classes}>
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
      <span
        className="ks-inline-edit__text"
        ref={textEl}
        contentEditable={isEditing}
        suppressContentEditableWarning={isEditing}
        role="textbox"
        onKeyDown={e => {
          // enter key
          if (e.which === 13) {
            handleControlTrigger();
          }
          // esc key
          if (e.which === 27) {
            handleTargetFocus();
          }
        }}
      >
        {text}
      </span>
      {showControls && (
        <span className="ks-inline-edit__controls">
          {btnState === 'save' && (
            <KsButton
              size={isHeading ? 'm' : 's'}
              icon="close"
              kind="icon"
              flush
              emphasis="danger"
              handleTrigger={handleTargetFocus}
            >
              close
            </KsButton>
          )}
          <KsButton
            size={isHeading ? 'm' : 's'}
            icon={btnState}
            kind="icon"
            flush
            handleTrigger={handleControlTrigger}
          >
            {btnState}
          </KsButton>
        </span>
      )}
    </span>
  );
};

type ConnectedProps = Omit<TextProps, 'canEdit'>;

export const InlineEditText: React.FC<ConnectedProps> = (
  props: ConnectedProps,
) => {
  const canEdit = useSelector(s => s.userState.canEdit);
  return (
    <InlineEditTextBase {...props} canEdit={canEdit} showControls={canEdit} />
  );
};
