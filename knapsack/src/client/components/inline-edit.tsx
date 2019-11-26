import React, { useState, useRef } from 'react';
import { KsButton } from '@knapsack/design-system';
import cn from 'classnames';
import './inline-edit.scss';
import { useSelector } from '../store';

type TextProps = {
  text: string;
  headingLevel?: number;
  showControls?: boolean;
  handleSave: (text: string) => void;
  canEdit: boolean;
};

export const InlineEditTextBase: React.FC<TextProps> = ({
  text,
  showControls = false,
  handleSave,
  canEdit,
}: TextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const textEl = useRef<HTMLSpanElement>();

  if (!canEdit) {
    return <span>{text}</span>;
  }

  const handleControlTrigger = () => {
    if (isEditing) {
      handleSave(textEl.current.textContent);
      setIsEditing(false);
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

  const classes = cn({
    'ks-inline-edit-text': true,
    'ks-inline-edit-text--controls-visible': showControls,
    'ks-inline-edit-text--editing': isEditing,
  });
  return (
    <span className={classes}>
      <span
        className="ks-inline-edit-text__text"
        ref={textEl}
        contentEditable={isEditing}
        suppressContentEditableWarning={isEditing}
      >
        {text}
      </span>
      {showControls && (
        <span className="ks-inline-edit-text__controls">
          <KsButton
            size="s"
            onClick={handleControlTrigger}
            onKeyPress={handleControlTrigger}
          >
            {isEditing ? 'Save' : 'Edit'}
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
  const isEditMode = useSelector(s => s.ui.isEditMode);
  return (
    <InlineEditTextBase
      {...props}
      canEdit={canEdit}
      showControls={isEditMode}
    />
  );
};
