import { getFileSizes } from 'get-file-sizes';
import { parse, relative, resolve } from 'path';
import chokidar from 'chokidar';
import { FileDb2 } from './dbs/file-db';
import {
  KnapsackAssetSetsData,
  KnapsackAssetSetsConfig,
  KnapsackAssetSetData,
} from '../schemas/asset-sets';
import schema from '../json-schemas/schemaKnapsackAssetSetsConfig';
import { fileExistsOrExit, isRemoteUrl } from './server-utils';
import * as log from '../cli/log';
import { EVENTS, knapsackEvents } from './events';

export class AssetSets extends FileDb2<KnapsackAssetSetsConfig> {
  data: KnapsackAssetSetsData;

  private readonly dataDir: string;

  private readonly publicDir: string;

  constructor({ dataDir, publicDir }: { dataDir: string; publicDir: string }) {
    super({
      dbDir: dataDir,
      name: 'knapsack.asset-sets',
      type: 'yml',
      validationSchema: schema,
      defaults: {},
    });

    this.dataDir = dataDir;

    this.publicDir = publicDir;

    this.getData();
  }

  convertConfigToData(config: KnapsackAssetSetsConfig): KnapsackAssetSetsData {
    const { allAssetSets, globalAssetSetIds } = config;
    const data: KnapsackAssetSetsData = {
      globalAssetSetIds,
      allAssetSets: {},
    };

    Object.keys(allAssetSets).forEach(assetSetId => {
      const assetSet = allAssetSets[assetSetId];
      data.allAssetSets[assetSetId] = {
        ...assetSet,
        assets: assetSet.assets.map(asset => {
          const isRemote = isRemoteUrl(asset.src);
          const src = isRemote ? asset.src : resolve(this.dataDir, asset.src);

          if (!isRemote) {
            fileExistsOrExit(src);
            if (relative(this.publicDir, src).includes('..')) {
              log.error(
                `Some CSS or JS is not publically accessible! These must be either remote or places inside the "public" dir (${this.publicDir})`,
              );
              process.exit(1);
            }
          }

          const { ext } = parse(src);
          const [size] = getFileSizes([src]);

          return {
            src,
            // isInHead: asset.isInHead === true,
            publicPath: isRemote ? src : `/${relative(this.publicDir, src)}`,
            type: ext.replace('.', ''),
            sizeRaw: size.sizeRaw,
            sizeKb: size.sizeKb,
          };
        }),
      };
    });

    return data;
  }

  /**
   * @todo evaluate - perhaps it's best to compute these type of values as needed instead of all up front when "config" is turned into "data"?
   * @param assetSrc
   */
  getAssetPublicPath(assetSrc: string): string {
    const isRemote = isRemoteUrl(assetSrc);
    const src = isRemote ? assetSrc : resolve(this.dataDir, assetSrc);

    if (!isRemote) {
      fileExistsOrExit(src);
      if (relative(this.publicDir, src).includes('..')) {
        log.error(
          `Some CSS or JS is not publically accessible! These must be either remote or places inside the "public" dir (${this.publicDir})`,
        );
        process.exit(1);
      }
    }

    return isRemote ? src : `/${relative(this.publicDir, src)}`;
  }

  static convertDataToConfig(
    data: KnapsackAssetSetsData,
  ): KnapsackAssetSetsConfig {
    const { allAssetSets, globalAssetSetIds } = data;
    const config: KnapsackAssetSetsConfig = {
      globalAssetSetIds,
      allAssetSets: {},
    };

    Object.keys(allAssetSets).forEach(assetSetId => {
      const assetSet = allAssetSets[assetSetId];
      config.allAssetSets[assetSetId] = {
        ...assetSet,
        assets: assetSet.assets.map(({ src }) => {
          return {
            src,
          };
        }),
      };
    });

    return data;
  }

  getData(): KnapsackAssetSetsData {
    const userConfig = this.getConfig();
    // this.config = this.config;

    this.data = this.convertConfigToData(userConfig);

    return this.data;
  }

  getAssetSet(assetSetId: string): KnapsackAssetSetData {
    return this.data.allAssetSets[assetSetId];
  }

  getGlobalAssetSets(): KnapsackAssetSetData[] {
    return this.data.globalAssetSetIds.map(id => this.data.allAssetSets[id]);
  }

  watch(): void {
    const paths: Set<string> = new Set();

    Object.values(this.data.allAssetSets).forEach(({ assets }) => {
      assets.forEach(asset => paths.add(asset.src));
    });

    const localAssetPaths = [...paths];

    const assetWatcher = chokidar.watch(localAssetPaths, {
      ignoreInitial: true,
    });

    assetWatcher.on('all', (event, path) => {
      knapsackEvents.emit(EVENTS.PATTERN_ASSET_CHANGED, { event, path });
    });
  }
}
