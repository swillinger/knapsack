import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { breakpoints } from '@knapsack/core';
import './smart-grid.scss';

// eslint-disable-next-line react/prefer-stateless-function
export default class SmartGrid extends Component {
  constructor(props) {
    super(props);
    this.generateGridMediaQueries = this.generateGridMediaQueries.bind(this);
  }

  generateGridMediaQueries = uniqueId => {
    const gutter = 16; // px
    const propBreakpoints = {
      xsmall: this.props['row-items-xsmall'],
      small: this.props['row-items-small'],
      medium: this.props['row-items-medium'],
      large: this.props['row-items-large'],
      xlarge: this.props['row-items-xlarge'],
      xxlarge: this.props['row-items-xxlarge'],
      xxxlarge: this.props['row-items-xxxlarge'],
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

  render() {
    const childrenGridItems = React.Children.map(this.props.children, child => {
      const uniqueId = [...Array(10)]
        /* eslint-disable-next-line no-bitwise */
        .map(() => (~~(Math.random() * 36)).toString(36))
        .join('');

      return (
        <>
          {this.generateGridMediaQueries(uniqueId)}
          <div className={`smart-grid__item smart-grid__item--${uniqueId}`}>
            {child}
          </div>
        </>
      );
    });

    return <div className="smart-grid">{childrenGridItems}</div>;
  }
}

// The value `0` below is used to infer "use the last value" Example: 'row-items-small' below inherits from 'row-items-xsmall'
SmartGrid.defaultProps = {
  'row-items-xsmall': 1,
  'row-items-small': 0,
  'row-items-medium': 2,
  'row-items-large': 3,
  'row-items-xlarge': 0,
  'row-items-xxlarge': 0,
  'row-items-xxxlarge': 0,
};

SmartGrid.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  'row-items-xsmall': PropTypes.number,
  'row-items-small': PropTypes.number,
  'row-items-medium': PropTypes.number,
  'row-items-large': PropTypes.number,
  'row-items-xlarge': PropTypes.number,
  'row-items-xxlarge': PropTypes.number,
  'row-items-xxxlarge': PropTypes.number,
};
