import React from 'react';
import PropMatrix from 'react-prop-matrix';
import { Icon, iconSizes, symbols } from './icon';

export default {
  title: 'Components|Atoms/Icon',
  component: Icon,
  decorators: [],
  parameters: {},
};

const options = {
  size: iconSizes,
  symbol: symbols,
};

export const allVariations = () => (
  <table style={{ minWidth: '300px' }}>
    <thead>
      <th style={{ textAlign: 'center' }}>Icon</th>
      <th style={{ textAlign: 'center' }}>Symbol Prop</th>
      <th style={{ textAlign: 'center' }}>Size Prop</th>
    </thead>
    <tbody>
      <PropMatrix options={options}>
        {({ size, symbol }) => (
          <tr>
            <td style={{ textAlign: 'center' }}>
              <Icon size={size} symbol={symbol} />
            </td>
            <td style={{ textAlign: 'center' }}>{symbol}</td>
            <td style={{ textAlign: 'center' }}>{size}</td>
          </tr>
        )}
      </PropMatrix>
    </tbody>
  </table>
);
