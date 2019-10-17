export interface KnapsackAssetSetUserConfig {
  id: string;
  title: string;
  assets: {
    src: string;
  }[];
  inlineCss?: string;
  inlineJs?: string;
  inlineHead?: string;
  inlineFoot?: string;
}

export interface KnapsackAssetSet extends KnapsackAssetSetUserConfig {
  assets: {
    src: string;
    publicPath: string;
    type: string;
    sizeKb: string;
    sizeRaw: number;
  }[];
}
