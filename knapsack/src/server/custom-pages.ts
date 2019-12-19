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
import globby from 'globby';
import { join } from 'path';
import { FileDb2 } from './dbs/file-db';
import {
  KnapsackCustomPagesData,
  KnapsackCustomPage,
} from '../schemas/custom-pages';
import { KnapsackDb, KnapsackFile } from '../schemas/misc';

export class CustomPages implements KnapsackDb<KnapsackCustomPagesData> {
  private dataDir: string;

  constructor({ dataDir }: { dataDir: string }) {
    this.dataDir = dataDir;
  }

  async getData(): Promise<KnapsackCustomPagesData> {
    const data: KnapsackCustomPagesData = {
      pages: {},
    };

    await globby(join(this.dataDir, 'knapsack.custom-page.*.yml')).then(
      async configFilePaths => {
        if (!configFilePaths) return;
        return Promise.all(
          configFilePaths.map(async configFilePath => {
            const db = new FileDb2<KnapsackCustomPage>({
              filePath: configFilePath,
              type: 'yml',
              watch: false,
              writeFileIfAbsent: false,
            });

            const config = await db.getData();

            data.pages[config.id] = config;

            return {
              db,
              config: await db.getData(),
            };
          }),
        );
      },
    );

    return data;
  }

  async savePrep(data: KnapsackCustomPagesData): Promise<KnapsackFile[]> {
    const allFiles: KnapsackFile[] = [];

    await Promise.all(
      Object.keys(data.pages).map(async id => {
        const page = data.pages[id];
        const db = new FileDb2<KnapsackCustomPage>({
          filePath: join(this.dataDir, `knapsack.custom-page.${id}.yml`),
          type: 'yml',
          watch: false,
          writeFileIfAbsent: false,
        });

        const files = await db.savePrep(page);
        files.forEach(file => allFiles.push(file));
      }),
    );
    // @todo handle custom pages that were deleted / renamed

    return allFiles;
  }
}
