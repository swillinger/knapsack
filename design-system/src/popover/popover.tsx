import React from 'react';
import Popover, { PopoverProps, ArrowContainer } from 'react-tiny-popover'; // https://www.npmjs.com/package/react-tiny-popover
import './popover.scss';
import { useHover } from '../utils/hooks';

type Props = Omit<PopoverProps, 'isOpen'> & {
  isOpen?: boolean;
  isHoverTriggered?: boolean;
};

export const KsPopover: React.FC<Props> = ({
  isHoverTriggered,
  content,
  isOpen,
  children,
  ...rest
}: Props) => {
  const [hoverRef, isHovered] = useHover();

  return (
    <Popover
      isOpen={isHoverTriggered ? (isHovered as boolean) : isOpen}
      content={({ position, targetRect, popoverRect }) => (
        <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
          position={position}
          targetRect={targetRect}
          popoverRect={popoverRect}
          arrowColor="white"
          arrowSize={10}
          arrowStyle={{ opacity: 0.7 }}
        >
          <div className="ks-popover__box">{content}</div>
        </ArrowContainer>
      )}
      {...rest}
    >
      <div className="ks-popover__children" ref={hoverRef as any}>
        {children}
      </div>
    </Popover>
  );
};
