import React from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import './figure.scss';

type Props = {
  figure?: React.ReactNode;
  figcaption?: React.ReactNode;
  linkPath?: string;
  width?: number;
};

export const KsFigure: React.FC<Props> = ({
  figure,
  figcaption,
  linkPath,
  width,
}: Props) => {
  const fig = () => (
    <figure style={{ width: `${width}px` }}>
      <div className="ks-figure__content">{figure}</div>
      {figcaption && <figcaption>{figcaption}</figcaption>}
    </figure>
  );

  return (
    <div className={cn('ks-figure', linkPath ? 'ks-figure--link' : '')}>
      {linkPath ? <Link to={linkPath}>{fig()}</Link> : <>{fig()}</>}
    </div>
  );
};
