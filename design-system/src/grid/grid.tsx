import React from 'react';
import cn from 'classnames';
import './grid.scss';

export enum KsGridItemSizes {
  's' = 's',
  'm' = 'm',
  'l' = 'l',
}

type Props = {
  gapSize?: 's' | 'm' | 'l';
  /**
   * Smaller items will have more per row
   */
  itemSize?: keyof typeof KsGridItemSizes;
  children: React.ReactNode;
};

export const KsGrid: React.FC<Props> = ({
  children,
  gapSize = 'm',
  itemSize = 'm',
}: Props) => {
  const classes = cn(
    'ks-grid',
    `ks-grid--gap-size-${gapSize}`,
    `ks-grid--item-size-${itemSize}`,
  );
  return (
    <section className={classes}>
      {React.Children.map(children, child => (
        <article className="ks-grid__item">{child}</article>
      ))}
    </section>
  );
};
