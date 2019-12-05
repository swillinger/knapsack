import React from 'react';
import { KsButton, PatternStatusIcon, Select } from '@knapsack/design-system';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { useSelector } from '../../store';
import './template-header.scss';
import { KnapsackTemplateStatus } from '../../../schemas/patterns';

type Props = {
  title: string;
  assetSets?: { title: string; id: string }[];
  assetSetId?: string;
  demoDataIndex?: number;
  demoDatasLength?: number;
  isTitleShown?: boolean;
  status?: KnapsackTemplateStatus;
  handleOpenNewTabClick: () => void;
  handleAssetSetChange: (newAssetSetId: string) => void;
  handleStatusChange: (newStatusId: string) => void;
  handleDemoNextClick: () => void;
  handleDemoPrevClick: () => void;
};

export const TemplateHeader: React.FC<Props> = ({
  title,
  assetSets = [],
  assetSetId,
  demoDataIndex,
  demoDatasLength,
  status,
  handleAssetSetChange,
  handleDemoNextClick,
  handleDemoPrevClick,
  handleOpenNewTabClick,
  handleStatusChange,
  isTitleShown = false,
}: Props) => {
  const canEdit = useSelector(s => s.userState.canEdit);
  const statuses = useSelector(s => s.patternsState.templateStatuses);

  return (
    <header className="ks-template-header ks-template-view__flex-wrapper">
      {isTitleShown && <h3 className="ks-template-header__title">{title}</h3>}
      {status && canEdit && (
        <Select
          label="Status"
          value={status.id}
          handleChange={handleStatusChange}
          items={statuses.map(s => {
            return {
              value: s.id,
              title: s.title,
            };
          })}
        />
      )}
      {status && !canEdit && (
        <h5 className="ks-eyebrow" style={{ marginBottom: '0' }}>
          Status: {status.title}
          <PatternStatusIcon color={status.color} title={status.title} />
        </h5>
      )}
      <div className="ks-template-header__controls">
        <KsButton onClick={() => handleOpenNewTabClick()}>
          Open in new window
        </KsButton>

        {assetSets && assetSets.length > 1 && (
          <Select
            items={assetSets.map(assetSet => ({
              title: assetSet.title,
              value: assetSet.id,
            }))}
            handleChange={handleAssetSetChange}
            value={assetSetId}
            label="Asset Sets"
          />
        )}

        {demoDatasLength > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                paddingRight: '3px',
                marginRight: '5px',
              }}
            >
              Demos:
            </div>
            <div>
              <KsButton
                disabled={demoDataIndex < 1}
                onClick={() => handleDemoPrevClick()}
              >
                <FaCaretLeft />
              </KsButton>
              <KsButton
                disabled={demoDataIndex === demoDatasLength - 1}
                onClick={() => handleDemoNextClick()}
              >
                <FaCaretRight />
              </KsButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
