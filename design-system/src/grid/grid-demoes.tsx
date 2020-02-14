import React from 'react';
import { KsGrid, KsGridItemSizes } from './grid';

const Box = () => {
  return (
    <div
      style={{
        background: '#ccc',
        width: '100%',
        height: '50px',
      }}
    >
      Item
    </div>
  );
};

export const sizes = () => {
  return Object.values(KsGridItemSizes).map(size => (
    <div key={size}>
      <h2>Size: {size}</h2>
      <KsGrid itemSize={size}>
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
      </KsGrid>
    </div>
  ));
};
