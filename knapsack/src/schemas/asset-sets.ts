interface KnapsackAssetSetBase {
  id: string;
  title: string;
  inlineCss?: string;
  inlineJs?: string;
  inlineHead?: string;
  inlineFoot?: string;
}

export interface KnapsackAssetSetConfig extends KnapsackAssetSetBase {
  assets: {
    src: string;
  }[];
}

export interface KnapsackAssetSetData extends KnapsackAssetSetBase {
  assets: {
    src: string;
    publicPath: string;
    type: string;
    sizeKb: string;
    sizeRaw: number;
  }[];
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
