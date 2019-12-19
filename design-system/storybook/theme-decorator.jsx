import React from 'react';
import '@knapsack/app/src/client/global/variables.css';
import '@knapsack/app/src/client/style.scss';

export function themeDecorator(story) {
  // return (<div style={{ fontSize: '18px', maxWidth: 1100 }}>{story()}</div>);
  return (
    <div
      style={{ backgroundColor: '#e0e0e0', margin: '10px', padding: '10px' }}
    >
      {story()}
    </div>
  );
}
