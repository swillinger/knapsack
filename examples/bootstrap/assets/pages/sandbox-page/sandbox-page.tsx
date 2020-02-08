import React from 'react';
import { SandboxPageProps } from '../../../dist/meta/react';

// function isFragment(item: React.ReactNode);

export default ({ gridItems, title, hero, pageTop }: SandboxPageProps) => {
  let realGridItems = gridItems;
  if (React.isValidElement(gridItems)) {
    realGridItems =
      gridItems?.type === React.Fragment ? gridItems.props.children : gridItems;
  }

  return (
    <div className="wrapper">
      {pageTop}
      {title && <h1>{title}</h1>}
      {hero}
      <div>
        {realGridItems && (
          <div className="container-fluid">
            <div className="row">
              {React.Children.map(realGridItems, gridItem => (
                <div
                  className="col"
                  style={{
                    margin: '.25rem',
                  }}
                >
                  {gridItem}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
