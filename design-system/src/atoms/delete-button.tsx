import React from 'react';
import { KsButton, SIZES } from './button';
import { KsPopover } from '../popover/popover';
import './delete-button.scss';

type Props = {
  /** Confirmation message shown in the popover. Default's to "Are you sure?". */
  confirmationMessage?: string | React.ReactNode;
  /** Text appearing in the confimration button in the popover. Default's to "Yes, delete.". */
  confirmBtnText?: string;
  size?: keyof typeof SIZES;
  /** Strip the delete button's default margin/padding. */
  flush?: boolean;
  /** Fires after the user has confirmed delete via the popover. */
  handleTrigger: () => void;
};

export const KsDeleteButton: React.FC<Props> = ({
  confirmationMessage = 'Are you sure?',
  confirmBtnText = 'Yes, delete.',
  size = 'm',
  flush = false,
  handleTrigger,
}: Props) => {
  return (
    <KsPopover
      trigger="click"
      content={
        <div className="ks-delete-btn__confirmation">
          {typeof confirmationMessage === 'string' ? (
            <p>{confirmationMessage}</p>
          ) : (
            confirmationMessage
          )}
          <KsButton
            kind="primary"
            emphasis="danger"
            isFullWidth
            handleTrigger={handleTrigger}
          >
            {confirmBtnText}
          </KsButton>
        </div>
      }
    >
      <KsButton icon="delete" kind="icon" size={size} flush={flush}>
        Delete
      </KsButton>
    </KsPopover>
  );
};
