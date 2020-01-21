import React from 'react';
import { Icon } from './icon';
import './details.scss';

type Props = {
  children: React.ReactNode;
  open?: boolean;
  /** The content that appears in the always-shown summary. */
  titleContent: string | React.ReactNode;
};

export const KsDetails: React.FC<Props> = ({
  children,
  open = false,
  titleContent,
}: Props) => {
  return (
    <details className="ks-details" open={open}>
      <summary>
        <div className="ks-details__collapser-icon">
          <Icon symbol="collapser" />
        </div>
        <div className="ks-details__title-content">{titleContent}</div>
      </summary>
      <div className="ks-details__content">{children}</div>
    </details>
  );
};
