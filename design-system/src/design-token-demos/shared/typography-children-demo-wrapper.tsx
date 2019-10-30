import React from 'react';
import './typography-children-demo-wrapper.scss';

type Props = {
  children?: React.ReactNode;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
};

export const TypographyChildrenDemoWrapper: React.FC<Props> = ({
  children,
  fontFamily,
  fontStyle = 'normal',
  fontWeight = '400',
}: Props) => {
  return (
    <div
      className="dtd-typography-children-demo-wrapper"
      style={{
        fontFamily,
        fontWeight: parseInt(fontWeight, 10),
        fontStyle,
      }}
    >
      {children}
    </div>
  );
};
