import React, { useContext } from 'react';
import { PatternStatusIcon, Select, KsPopover } from '@knapsack/design-system';
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
  handleAssetSetChange: (newAssetSetId: string) => void;
  handleStatusChange: (newStatusId: string) => void;
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
  const select = (
    <Select
      items={assetSets.map(assetSet => ({
        title: assetSet.title,
        value: assetSet.id,
      }))}
      handleChange={handleAssetSetChange}
      value={assetSetId}
      label="Asset Sets"
      disabled={isDemoSettingAssetSetId}
    />
  );

  return (
    <header className="ks-template-header ks-template-view__flex-wrapper">
      {isTitleShown && <h3 className="ks-template-header__title">{title}</h3>}
      {canEdit && (
        <Select
          label="Status"
          value={status?.id ?? ''}
          handleChange={handleStatusChange}
          items={[
            {
              value: '',
              title: '',
            },
            ...statuses.map(s => {
              return {
                value: s.id,
                title: s.title,
              };
            }),
          ]}
        />
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
                {select}
              </KsPopover>
            )}
          </>
        )}
      </div>
    </header>
  );
};
