import React from 'react';
import '@basalt/knapsack/src/client/global/variables.css';
import '@basalt/knapsack/src/client/style.scss';

export function themeDecorator(story) {
  // return (<div style={{ fontSize: '18px', maxWidth: 1100 }}>{story()}</div>);
  return (
    <div style={{ backgroundColor: 'white', margin: '10px', padding: '10px' }}>
      {story()}
    </div>
  );
}
