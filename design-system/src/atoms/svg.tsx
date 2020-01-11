import React from 'react';
import './svg.scss';

type Props = {
  svg: string;
  className?: string;
  style?: React.CSSProperties;
};

export const KsSvg: React.FC<Props> = ({
  svg,
  className = '',
  style,
}: Props) => {
  return (
    <span
      className={`ks-svg ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
