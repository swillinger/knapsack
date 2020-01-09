import React from 'react';
import { KnapsackTemplateStatus } from '@knapsack/app/src/schemas/patterns';
import './status-icon.scss';

type Props = {
  status: KnapsackTemplateStatus;
  hasTitle?: boolean;
};

export const StatusIcon: React.FC<Props> = ({
  status,
  hasTitle = false,
}: Props) => {
  return (
    <div className="ks-status-icon">
      <div
        className="ks-status-icon__icon"
        style={{ backgroundColor: status?.color ?? '#ccc' }}
      />
      {hasTitle && (
        <span className="ks-status-icon__title">{status.title}</span>
      )}
    </div>
  );
};
