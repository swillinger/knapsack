import React, { Component } from 'react';
import './smart-grid.scss';

// @todo consider pulling from core or elsewhere
const breakpoints = {
  xsmall: '380px',
  small: '450px',
  medium: '700px',
  large: '900px',
  xlarge: '1100px',
  xxlarge: '1300px',
  xxxlarge: '1600px',
};

type Props = {
  children: React.ReactNode;
  'row-items-xsmall'?: number;
  'row-items-small'?: number;
  'row-items-medium'?: number;
  'row-items-large'?: number;
  'row-items-xlarge'?: number;
  'row-items-xxlarge'?: number;
  'row-items-xxxlarge'?: number;
};

// eslint-disable-next-line react/prefer-stateless-function
export const SmartGrid: React.FC<Props> = (props: Props) => {
  // static defaultProps: typeof defaultProps;

  const generateGridMediaQueries = uniqueId => {
    const gutter = 16; // px
    const propBreakpoints = {
      xsmall: props['row-items-xsmall'] || 1,
      small: props['row-items-small'] || 0,
      medium: props['row-items-medium'] || 2,
      large: props['row-items-large'] || 3,
      xlarge: props['row-items-xlarge'] || 0,
      xxlarge: props['row-items-xxlarge'] || 0,
      xxxlarge: props['row-items-xxxlarge'] || 0,
    };

    const queries = Object.keys(breakpoints).map(bp => {
      if (propBreakpoints[bp]) {
        return `
          @media (min-width: ${breakpoints[bp]}) {
            .smart-grid__item.smart-grid__item--${uniqueId} {
              width: calc(
                ${100 / propBreakpoints[bp]}% +
                ${gutter / propBreakpoints[bp]}px - ${gutter}px
              );
            }
          }
        `;
      }
      return '';
    });

    return <style>{queries}</style>;
  };

  const childrenGridItems = React.Children.map(props.children, child => {
    const uniqueId = [...Array(10)]
      /* eslint-disable-next-line no-bitwise */
      .map(() => (~~(Math.random() * 36)).toString(36))
      .join('');

    return (
      <>
        {generateGridMediaQueries(uniqueId)}
        <div className={`smart-grid__item smart-grid__item--${uniqueId}`}>
          {child}
        </div>
      </>
    );
  });

  return <div className="smart-grid">{childrenGridItems}</div>;
};
