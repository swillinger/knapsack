import { join } from 'path';
import { writeYaml } from '../server/server-utils';
import { KnapsackAssetSetsConfig } from '../schemas/asset-sets';

export async function convertV1ConfigToV2({
  data,
  assetSets,
}: {
  /**
   * Data Directory
   */
  data: string;
  assetSets: KnapsackAssetSetsConfig;
}) {
  // @todo mv `knapsack.settings.json`.customSections => `knapsack.custom-pages.json`.sections
  await writeYaml(join(data, 'knapsack.asset-sets.yml'), { assetSets });
}
