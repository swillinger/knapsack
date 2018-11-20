interface BedrockSettingsStoreConfig {
  dataDir: string;
}

interface BedrockSettings {
  title: string;
  subtitle?: string;
  slogan?: string;
  parentBrand?: {
    homepage?: string;
    /** image url */
    logo?: string;
    title?: string;
  }
}
