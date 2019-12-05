/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
import { join } from 'path';
import parseDataUrl from 'data-urls';
import { FileDb2 } from './dbs/file-db';
import {
  KnapsackSettings,
  KnapsackSettingsStoreConfig,
} from '../schemas/knapsack.settings';
import knapsackSettingsSchema from '../json-schemas/schemaKnapsackSettings';
import { KnapsackFile } from '../schemas/misc';

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 */
const isDataUrl = (dataString: string): boolean =>
  dataString.startsWith('data:');

export class Settings extends FileDb2<KnapsackSettings> {
  private publicDir: string;

  constructor({ dataDir, publicDir }: KnapsackSettingsStoreConfig) {
    const defaults: KnapsackSettings = {
      title: 'My Title',
      parentBrand: {},
    };

    super({
      filePath: join(dataDir, 'knapsack.settings.json'),
      defaults,
      type: 'json',
      validationSchema: knapsackSettingsSchema,
    });

    this.publicDir = publicDir;
  }

  async savePrep(config: KnapsackSettings): Promise<KnapsackFile[]> {
    const files: KnapsackFile[] = [];
    let { parentBrand } = config;
    if (parentBrand?.logo && isDataUrl(parentBrand.logo)) {
      const { mimeType, body } = parseDataUrl(parentBrand.logo);
      // console.log();

      const { type, subtype, parameters } = mimeType;
      const name = parameters.get('name');
      const logoPath = `/${name}`;
      // if (type === 'image') {
      files.push({
        path: join(this.publicDir, name),
        // contents: parentBrand.logo,
        contents: Buffer.from(body as string).toString('base64'),
        encoding: 'base64',
      });
      // }
      parentBrand = {
        ...parentBrand,
        logo: logoPath,
      };
    }
    return [
      ...files,
      ...(await super.savePrep({
        ...config,
        parentBrand,
      })),
    ];
  }

  async getData(): Promise<KnapsackSettings> {
    return super.getData();
  }
}
