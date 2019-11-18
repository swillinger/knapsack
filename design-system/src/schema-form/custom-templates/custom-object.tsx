import React from 'react';
import PropTypes from 'prop-types';

export default function ObjectFieldTemplate({ properties }) {
  return (
    <div className="ks-custom-object">
      {properties.map(prop => (
        <div key={prop.content.key} className="ks-custom-object-item">
          {prop.content}
        </div>
      ))}
    </div>
  );
}

ObjectFieldTemplate.defaultProps = {
  properties: [],
};

ObjectFieldTemplate.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.object),
};
