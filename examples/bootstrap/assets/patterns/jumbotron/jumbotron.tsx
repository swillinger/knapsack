import * as React from 'react';
import cn from 'classnames';
import { JumbotronProps } from '../../../dist/meta/react';

const Jumbotron: React.FC<JumbotronProps> = ({
  title,
  body,
  children,
}: JumbotronProps) => {
  return (
    <div className="jumbotron">
      <h1 className="display-4">{title}</h1>
      <p className="lead">{body}</p>
      {children}
    </div>
  );
};

export default Jumbotron;
