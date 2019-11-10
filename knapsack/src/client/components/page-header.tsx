import React from 'react';
import classNames from 'classnames';
import { StatusMessage } from '@knapsack/design-system';
import { useSelector } from '../store';
import './page-header.scss';

type Props = {
  title?: string;
  section?: string;
};

export const PageHeader: React.FC<Props> = ({ title, section }: Props) => {
  const status = useSelector(({ ui }) => ui.status);

  const classes = classNames({
    'k-page-header': true,
    'k-page-header--has-status': status,
    'k-page-header--has-title': title,
    'k-page-header--has-section': section,
    'k-page-header--is-empty': !section && !title && !status,
  });
  return (
    <header className={classes}>
      {section && <h4 className="k-page-header__section">{section}</h4>}
      {title && <h2 className="k-page-header__title">{title}</h2>}
      {status && (
        <div className="k-page-header__status">
          <StatusMessage type={status.type} message={status.message} />
        </div>
      )}
    </header>
  );
};
