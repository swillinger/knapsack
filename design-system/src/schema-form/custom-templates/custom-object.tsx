import React from 'react';
import { ObjectFieldTemplateProps } from 'react-jsonschema-form';

const ObjectFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  properties,
}: ObjectFieldTemplateProps) => {
  return (
    <div className="ks-custom-object">
      {properties.map(prop => (
        <div key={prop.content.key} className="ks-custom-object-item">
          {prop.content}
        </div>
      ))}
    </div>
  );
};

export default ObjectFieldTemplate;
