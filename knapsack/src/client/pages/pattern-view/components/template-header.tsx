import React, { useContext } from 'react';
import {
  PatternStatusIcon,
  KsSelect,
  SelectOptionProps,
  KsPopover,
} from '@knapsack/design-system';
import { CurrentTemplateContext } from '../current-template-context';
import { useSelector } from '../../../store';
import './template-header.scss';
import { KnapsackTemplateStatus } from '../../../../schemas/patterns';

type Props = {
  title?: string;
  assetSets?: { title: string; id: string }[];
  assetSetId?: string;
  isTitleShown?: boolean;
  status?: KnapsackTemplateStatus;
  handleAssetSetChange: (newAssetSet: SelectOptionProps) => void;
  handleStatusChange: (newStatus: SelectOptionProps) => void;
};

export const TemplateHeader: React.FC<Props> = ({
  assetSets = [],
  assetSetId,
  status,
  handleAssetSetChange,
  handleStatusChange,
  isTitleShown = false,
  ...rest
}: Props) => {
  const statuses = useSelector(s => s.patternsState.templateStatuses);
  const { title = rest.title, canEdit, demo } = useContext(
    CurrentTemplateContext,
  );

  const isDemoSettingAssetSetId = !!demo?.assetSetId;
  const select = () => {
    const selectAssetSet = assetSetId
      ? assetSets.find(a => a.id === assetSetId)
      : null;

    return (
      <KsSelect
        options={assetSets.map(assetSet => ({
          label: assetSet.title,
          value: assetSet.id,
        }))}
        handleChange={handleAssetSetChange}
        value={{
          label: selectAssetSet ? selectAssetSet.title : '',
          value: selectAssetSet ? selectAssetSet.id : '',
        }}
        label="Asset Sets"
        disabled={isDemoSettingAssetSetId}
      />
    );
  };

  return (
    <header className="ks-template-header ks-template-view__flex-wrapper">
      {isTitleShown && <h3 className="ks-template-header__title">{title}</h3>}
      {canEdit && (
        <span className="ks-template-header__status-select">
          <KsSelect
            label="Status"
            isLabelInline
            isStatusList
            value={
              status
                ? {
                    value: status.id,
                    label: status.title,
                    color: status.color,
                  }
                : {
                    value: 'error',
                    label: 'Error: No Status Assigned.',
                    color: 'var(--c-error)',
                  }
            }
            handleChange={handleStatusChange}
            options={[
              ...statuses.map(s => {
                return {
                  value: s.id,
                  label: s.title,
                  color: s.color,
                };
              }),
            ]}
          />
        </span>
      )}
      {status && !canEdit && (
        <p>
          Status:
          <PatternStatusIcon color={status.color} title={status.title} />{' '}
          {status.title}
        </p>
      )}
      <div className="ks-template-header__controls">
        {assetSets && assetSets.length > 1 && (
          <>
            {!isDemoSettingAssetSetId && select}
            {isDemoSettingAssetSetId && (
              <KsPopover
                trigger="hover"
                content={
                  <p>
                    Disabled due to current demo having a specific <br />
                    asset set used currently. Switch demo to regain control.
                  </p>
                }
              >
                <>{select}</>
              </KsPopover>
            )}
          </>
        )}
      </div>
    </header>
  );
};
