export interface Paths {
  patterns: string[];
  newPatternDir: string;
  assetDir: string;
  assets: {
    css: string[];
    js?: string[];
  }
}
