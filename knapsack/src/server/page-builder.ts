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
import GraphQLJSON from 'graphql-type-json';
import { FileDb } from './dbs/file-db';
import { PageBuilderPage, PageBuilderSlice } from '../schemas/page-builder';

export { pageBuilderPagesTypeDef } from '../schemas/page-builder';

export class PageBuilder {
  db: FileDb;

  constructor({
    dataDir,
  }: {
    /**
     * Directory to read/write examples files to
     */
    dataDir: string;
  }) {
    this.db = new FileDb({
      dbDir: dataDir,
      name: 'knapsack.page-builder',
      defaults: {},
    });
  }

  async getPageBuilderPage(id: string): Promise<PageBuilderPage> {
    return this.db.get(id);
  }

  async getPageBuilderPages(): Promise<PageBuilderPage[]> {
    return this.db.values();
  }

  async setPageBuilderPage(
    id: string,
    data: PageBuilderPage,
  ): Promise<{
    ok: boolean;
    message: string;
  }> {
    try {
      this.db.set(id, data);
      return {
        ok: true,
        message: `PageBuilderPage ${id} saved successfully!`,
      };
    } catch (e) {
      return {
        ok: false,
        message: `PageBuilderPage ${id} NOT saved successfully. ${e.toString()}`,
      };
    }
  }
}

export const pageBuilderPagesResolvers = {
  Query: {
    pageBuilderPage: (parent, { id }, { pageBuilderPages }) =>
      pageBuilderPages.getPageBuilderPage(id),
    pageBuilderPages: (parent, args, { pageBuilderPages }) =>
      pageBuilderPages.getPageBuilderPages(),
  },
  Mutation: {
    setPageBuilderPage: async (
      parent,
      { id, data },
      { pageBuilderPages, canWrite },
    ) => {
      if (!canWrite) return false;
      await pageBuilderPages.setPageBuilderPage(id, data);
      return pageBuilderPages.getPageBuilderPage(id);
    },
  },
  JSON: GraphQLJSON,
};
