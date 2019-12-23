import React, { useState } from 'react';
import Popover, { PopoverProps, ArrowContainer } from 'react-tiny-popover'; // https://www.npmjs.com/package/react-tiny-popover
import './popover.scss';
import { useHover } from '../utils/hooks';

type Props = Omit<PopoverProps, 'isOpen'> & {
  isOpen?: boolean;
  isHoverTriggered?: boolean;
  trigger?: 'prop' | 'hover' | 'click';
};

export const KsPopover: React.FC<Props> = ({
  isHoverTriggered,
  content,
  isOpen,
  children,
  trigger = 'hover',
  ...rest
}: Props) => {
  const [hoverRef, isHovered] = useHover();
  const [isPopoverOpen, setOpen] = useState();
  const handleChildTrigger = () => {
    if (trigger === 'click') {
      setOpen(cur => !cur);
    }
  };
  // @todo re-enable, fix offset arrow caused by margin
  const hasArrow = false;

  let open;
  switch (trigger) {
    case 'click':
      open = isPopoverOpen;
      break;
    case 'hover':
      open = isHovered;
      break;
    case 'prop':
      open = isOpen;
      break;
  }
  return (
    <Popover
      // @todo re-enable, then fix bug where you can see it but the z-index is too low (shows popover as a popunder)
      transitionDuration={0}
      isOpen={open}
      onClickOutside={() => {
        if (trigger === 'click') {
          setOpen(false);
        }
      }}
      content={({ position, targetRect, popoverRect }) => {
        const popoverContent = <div className="ks-popover__box">{content}</div>;
        if (hasArrow) {
          return (
            <ArrowContainer
              position={position}
              targetRect={targetRect}
              popoverRect={popoverRect}
              arrowColor="white"
              arrowSize={10}
              arrowStyle={{ opacity: 0.7 }}
            >
              {popoverContent}
            </ArrowContainer>
          );
        }
        return popoverContent;
      }}
      {...rest}
    >
      <div
        className="ks-popover__children"
        ref={hoverRef as any}
        onClick={handleChildTrigger}
        onKeyPress={handleChildTrigger}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
    </Popover>
  );
};
