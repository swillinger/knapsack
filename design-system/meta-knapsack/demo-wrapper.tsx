import * as React from 'react';
import '../dist/ks-design-system.css';

const DemoWrapper: React.FC = ({ children }) => {
  return <div className="demo-wrapper">{children}</div>;
};

export default DemoWrapper;
