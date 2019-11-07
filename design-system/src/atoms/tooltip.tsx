import React from 'react';
import './tooltip.scss';

type Position = 'top' | 'bottom' | 'right' | 'left';

type Props = {
  children: React.ReactNode;
  tooltipContent: string;
  bgColor?: string;
  textColor?: string;
  position: Position;
};

export const Tooltip: React.FC<Props> = ({
  children,
  bgColor = 'white',
  position = 'top',
  textColor = '#484848',
  tooltipContent,
}: Props) => {
  return (
    <div
      className="k-tooltip"
      // bg_color={props.bgColor}
      // text_color={props.textColor}
      data-position={position}
    >
      {children}
      <span
        style={{
          background: bgColor,
          color: textColor,
        }}
      >
        {tooltipContent}
      </span>
    </div>
  );
};
