interface KnapsackAssetSetBase {
  id: string;
  title: string;
  inlineCss?: string;
  inlineJs?: string;
  inlineHead?: string;
  inlineFoot?: string;
}

type KsAssetConfig = {
  src: string;
  /**
   * Force this asset to load in either the head or foot of the HTML page.
   * CSS defaults to head and JS default to foot
   */
  tagLocation?: 'head' | 'foot';
};

export interface KnapsackAssetSetConfig extends KnapsackAssetSetBase {
  assets: KsAssetConfig[];
}

type KsAssetData = KsAssetConfig & {
  publicPath: string;
  type: string;
  sizeKb?: string;
  sizeRaw?: number;
};

export interface KnapsackAssetSetData extends KnapsackAssetSetBase {
  assets: KsAssetData[];
}

export type KnapsackAssetSet = KnapsackAssetSetData;

export interface KnapsackAssetSetsConfig {
  globalAssetSetIds?: string[];
  allAssetSets?: {
    [id: string]: KnapsackAssetSetConfig;
  };
}

export interface KnapsackAssetSetsData {
  globalAssetSetIds?: string[];
  allAssetSets?: {
    [id: string]: KnapsackAssetSetData;
  };
}
