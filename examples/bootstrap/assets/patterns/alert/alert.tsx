import * as React from 'react';
import cn from 'classnames';
import { AlertProps } from '../../../dist/meta/react';

const Alert: React.FC<AlertProps> = ({
  type = 'primary',
  message,
  footer,
}: AlertProps) => {
  const classes = cn('alert', `alert-${type}`, {});
  return (
    <div className={classes}>
      {message}
      {footer && <div style={{ marginTop: '1rem' }}>{footer}</div>}
    </div>
  );
};

export default Alert;
