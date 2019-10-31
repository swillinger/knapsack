import React from 'react';
import { Button, Select } from '@knapsack/design-system';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import './template-header.scss';

type Props = {
  title: string;
  assetSets?: { title: string; id: string }[];
  assetSetId?: string;
  demoDatas?: object[];
  demoDataIndex?: number;
  isTitleShown?: boolean;
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
  demoDatas = [],
  handleAssetSetChange,
  handleDemoNextClick,
  handleDemoPrevClick,
  handleOpenNewTabClick,
  isTitleShown = false,
}: Props) => {
  return (
    <header className="ks-template-header template-view__flex-wrapper">
      {isTitleShown && <h3 className="ks-template-header__title">{title}</h3>}
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
            handleChange={newAssetSetId => handleAssetSetChange(newAssetSetId)}
            value={assetSetId}
            label="Asset Sets"
          />
        )}

        {demoDatas.length > 1 && (
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
                disabled={demoDataIndex === demoDatas.length - 1}
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
