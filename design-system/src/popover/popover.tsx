import React, { useState, CSSProperties } from 'react';
import Popover, { PopoverProps, ArrowContainer } from 'react-tiny-popover'; // https://www.npmjs.com/package/react-tiny-popover
import './popover.scss';
import { useHover } from '../utils/hooks';

type Props = Omit<PopoverProps, 'isOpen'> & {
  isOpen?: boolean;
  isHoverTriggered?: boolean;
  trigger?: 'prop' | 'hover' | 'click';
  maxWidth?: number;
  hasArrow?: boolean;
};

export const KsPopover: React.FC<Props> = ({
  isHoverTriggered,
  content,
  isOpen,
  children,
  maxWidth,
  hasArrow = true,
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
  const contentStyle: CSSProperties = {};
  if (maxWidth) {
    contentStyle.maxWidth = `${maxWidth}px`;
  }
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
      containerClassName="ks-popover__box"
      containerStyle={{
        // set to override `overflow: hidden` from lib since that was cutting off our `box-shadow`; may have un-intended consequences
        overflow: 'visible',
      }}
      padding={10}
      content={({ position, targetRect, popoverRect }) => {
        const popoverContent = (
          <div className="ks-popover__box-inner" style={contentStyle}>
            {content}
          </div>
        );
        if (hasArrow) {
          return (
            <ArrowContainer
              position={position}
              targetRect={targetRect}
              popoverRect={popoverRect}
              arrowColor="white"
              arrowSize={10}
              arrowStyle={{
                opacity: 1,
                zIndex: 201, // 1 higher than `.ks-popover__box-inner`
              }}
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
