import React from 'react';
import { Button, PatternStatusIcon, Select } from '@knapsack/design-system';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
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
  isTitleShown = false,
}: Props) => {
  return (
    <header className="ks-template-header ks-template-view__flex-wrapper">
      {isTitleShown && <h3 className="ks-template-header__title">{title}</h3>}
      {status && (
        <h5 className="ks-eyebrow" style={{ marginBottom: '0' }}>
          Status: {status.title}
          <PatternStatusIcon color={status.color} title={status.title} />
        </h5>
      )}
      <div className="ks-template-header__controls">
        <Button onClick={() => handleOpenNewTabClick()}>
          Open in new window
        </Button>

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
              <Button
                disabled={demoDataIndex < 1}
                onClick={() => handleDemoPrevClick()}
              >
                <FaCaretLeft />
              </Button>
              <Button
                disabled={demoDataIndex === demoDatasLength - 1}
                onClick={() => handleDemoNextClick()}
              >
                <FaCaretRight />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
