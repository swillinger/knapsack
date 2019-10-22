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
import { KnapsackCustomPage } from '../schemas/custom-pages';

export { customPagesTypeDef } from '../schemas/custom-pages';

export class CustomPages {
  db: FileDb;

  constructor({ dataDir }: { dataDir: string }) {
    const defaults = {
      pages: [],
    };

    this.db = new FileDb({
      dbDir: dataDir,
      name: 'knapsack.custom-pages',
      defaults,
    });
  }

  getCustomPage(path: string): KnapsackCustomPage {
    const page = this.getCustomPages().find(p => p.path === path);
    if (page) return page;
    return this.createCustomPage(path);
  }

  createCustomPage(path: string): KnapsackCustomPage {
    const pages = this.getCustomPages();
    const newPage: KnapsackCustomPage = { path, slices: [] };
    pages.push(newPage);
    this.db.set('pages', pages);
    return newPage;
  }

  getCustomPages(): KnapsackCustomPage[] {
    return this.db.get('pages');
  }

  setCustomPage(path: string, data: KnapsackCustomPage): KnapsackCustomPage {
    const pages: KnapsackCustomPage[] = this.db.get('pages');
    const newPage: KnapsackCustomPage = {
      path,
      ...data,
    };
    const newPages = pages.map(page => {
      if (page.path !== path) return page;
      return newPage;
    });
    this.db.set('pages', newPages);
    return newPage;
  }
}

export const customPagesResolvers = {
  Query: {
    customPage: (parent, { path }, { customPages }) =>
      customPages.getCustomPage(path),
    customPages: (parent, args, { customPages }) =>
      customPages.getCustomPages(),
  },
  Mutation: {
    setCustomPage: (
      parent,
      { path, customPage },
      { customPages, canWrite },
    ) => {
      if (!canWrite) return false;
      return customPages.setCustomPage(path, customPage);
    },
  },
  JSON: GraphQLJSON,
};
