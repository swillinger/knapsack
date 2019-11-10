// To generate JSON schemas in the `./json` folder, place any types in here, then add them to the `typeNamesToExportToJsonSchema` array in `convert-types-to-json-schemas.js`
import { KnapsackCustomPagesData } from './custom-pages';

export { KnapsackSettings } from './knapsack.settings';

type KnapsackCustomPageSettingsForm = Pick<KnapsackCustomPagesData, 'sections'>;
