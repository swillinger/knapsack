import React, { useState, useRef } from 'react';
import { Button } from '@knapsack/design-system';
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
  showControls = true,
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
    'k-inline-edit-text': true,
    'k-inline-edit-text--controls-visible': showControls,
    'k-inline-edit-text--editing': isEditing,
  });
  return (
    <span className={classes}>
      <span
        className="k-inline-edit-text__text"
        ref={textEl}
        contentEditable={isEditing}
        suppressContentEditableWarning={isEditing}
      >
        {text}
      </span>
      <span className="k-inline-edit-text__controls">
        <Button
          size="s"
          onClick={handleControlTrigger}
          onKeyPress={handleControlTrigger}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>
      </span>
    </span>
  );
};

export const InlineEditText: React.FC<Omit<TextProps, 'canEdit'>> = (
  props: Omit<TextProps, 'canEdit'>,
) => {
  const canEdit = useSelector(s => s.userState.canEdit);
  return <InlineEditTextBase {...props} canEdit={canEdit} />;
};
