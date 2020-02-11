import React from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import './figure.scss';

type Props = {
  figure?: React.ReactNode;
  figcaption?: React.ReactNode;
  linkPath?: string;
  handleTrigger?: () => void;
};

export const KsFigure: React.FC<Props> = ({
  figure,
  figcaption,
  handleTrigger,
}: Props) => {
  const classes = cn('ks-figure', {
    'ks-figure--is-link': !!handleTrigger,
  });
  return (
    <div
      className={classes}
      role="button"
      tabIndex={0}
      onClick={() => {
        if (handleTrigger) handleTrigger();
      }}
      onKeyPress={e => {
        if (!handleTrigger) return;
        // only continue if key is enter or space
        if (
          // enter
          e.which === 13 ||
          // space
          e.which === 32
        ) {
          handleTrigger();
        }
      }}
    >
      <figure className="ks-figure__figure">
        <div className="ks-figure__content">{figure}</div>
        {figcaption && (
          <figcaption className="ks-figure__caption">{figcaption}</figcaption>
        )}
      </figure>
    </div>
  );
};
