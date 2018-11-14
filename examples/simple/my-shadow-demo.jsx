import React from 'react';

const MyShadowDemo = (props) => {
  console.log({ props });
  const {
    /** @type {DesignToken[]} */
    boxShadows
  } = props;
  return (
    <div>
      <h2>My Shadow Demo</h2>
      {boxShadows && (
        <div>
          <h3>Box Shadows</h3>
          {boxShadows.map(boxShadow => (
            <div
              key={boxShadow.name}
              style={{
                boxShadow: boxShadow.value,
              }}
            >
              <h4>{boxShadow.name}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyShadowDemo;
