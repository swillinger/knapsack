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
  };
  customSections: {
    id: string;
    title: string;
    showInMainMenu: boolean;
    pages: {
      id: string;
      title: string;
    }[];
  }[];
}
