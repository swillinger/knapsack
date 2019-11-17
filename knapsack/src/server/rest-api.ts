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
import express from 'express';
import urlJoin from 'url-join';
import md from 'marked';
import highlight from 'highlight.js';
import { qsParse } from './server-utils';
import { MemDb } from './dbs/mem-db';
import * as log from '../cli/log';
import {
  BASE_PATHS,
  // PERMISSIONS
} from '../lib/constants';
import { getRole } from './auth';
import { KnapsackBrain, KnapsackConfig } from '../schemas/main-types';
import { KnapsackMeta } from '../schemas/misc';
import { KnapsackTemplateDemo } from '../schemas/patterns';

const router = express.Router();
const memDb = new MemDb<KnapsackTemplateDemo>();

// https://marked.js.org/#/USING_ADVANCED.md
md.setOptions({
  highlight: code => highlight.highlightAuto(code).value,
});

export function getApiRoutes({
  registerEndpoint,
  patternManifest,
  pageBuilder,
  settingsStore,
  meta,
  baseUrl,
  tokens,
}: {
  patternManifest: KnapsackBrain['patterns'];
  webroot: string;
  public: string;
  baseUrl: string;
  meta: KnapsackMeta;
  tokens: KnapsackBrain['tokens'];
  pageBuilder: KnapsackBrain['pageBuilderPages'];
  settingsStore: KnapsackBrain['settings'];
  registerEndpoint: (pathname: string, method?: 'GET' | 'POST') => void;
  templateRenderers: KnapsackConfig['templateRenderers'];
}): typeof router {
  router.get(baseUrl, (req, res) => {
    res.json({
      ok: true,
      message: 'Welcome to the API!',
    });
  });

  {
    const url = urlJoin(baseUrl, 'data');
    registerEndpoint(url, 'POST');
    router.post(url, async (req, res) => {
      const { body, headers } = req;
      if (headers['content-type'] !== 'application/json') {
        res.send({
          ok: false,
          message:
            "Must send with a Header of 'Content-Type: application/json'",
        });
        return;
      }

      const hash = memDb.addData(body);
      res.send({
        ok: true,
        message: `Data has been made and can be viewed with hash "${hash}"`,
        data: {
          hash,
        },
      });
    });
  }

  if (patternManifest) {
    const url = urlJoin(baseUrl, '/render');
    registerEndpoint(url, 'GET');
    router.get(url, async (req, res) => {
      const { query } = req;
      const {
        patternId,
        templateId,
        // data: dataString,
        isInIframe: isInIframeString = 'false',
        wrapHtml: wrapHtmlString = 'true',
        assetSetId,
        // demoDataId,
        dataId,
      } = query;

      // const dataApproaches = [dataString, demoDataId, dataId].filter(Boolean)
      //   .length;
      // if (dataApproaches > 1) {
      //   const msg = `Error: trying to render using multiple data sources, choose one.`;
      //   log.error(msg, { query });
      //   res.send(`<p>${msg}</p>`);
      //   return;
      // }

      // let data: KnapsackTemplateData = dataString ? qsParse(dataString) : dataString;
      const demo = memDb.getData(dataId);
      const isInIframe = isInIframeString === 'true';
      const wrapHtml = wrapHtmlString === 'true';

      const results = await patternManifest.render({
        patternId,
        templateId,
        demo,
        wrapHtml,
        isInIframe,
        websocketsPort: meta.websocketsPort,
        assetSetId,
        // demoDataId,
      });

      if (results.ok) {
        res.send(results.html);
      } else {
        log.error(`Error rendering template`, {
          patternId,
          templateId,
          demo,
          wrapHtml,
          isInIframe,
          assetSetId,
          message: results.message,
        });
        res.send(results.message);
      }
    });
  }

  if (patternManifest) {
    const url1 = urlJoin(baseUrl, 'pattern/:id');
    registerEndpoint(url1);
    router.get(url1, async (req, res) => {
      const results = await patternManifest.getPattern(req.params.id);
      res.send(results);
    });

    const url2 = urlJoin(baseUrl, 'patterns');
    registerEndpoint(url2);
    router.get(url2, async (req, res) => {
      const results = await patternManifest.getPatterns();
      res.send(results);
    });
  }

  if (pageBuilder) {
    const url1 = urlJoin(baseUrl, `${BASE_PATHS.PAGE_BUILDER}/:id`);
    registerEndpoint(url1);
    router.get(url1, async (req, res) => {
      try {
        const page = await pageBuilder.getPageBuilderPage(req.params.id);
        res.send({
          ok: true,
          page,
        });
      } catch (error) {
        if (error.code === 'ENOENT') {
          res.send({
            ok: false,
            message: `Example "${req.params.id}" not found.`,
          });
        } else {
          res.send({
            ok: false,
            message: error.toString(),
          });
        }
      }
    });

    const url2 = urlJoin(baseUrl, `${BASE_PATHS.PAGE_BUILDER}/:id`);
    registerEndpoint(url2, 'POST');
    router.post(url2, async (req, res) => {
      const results = await pageBuilder.setPageBuilderPage(
        req.params.id,
        req.body,
      );
      res.send(results);
    });

    const url3 = urlJoin(baseUrl, BASE_PATHS.PAGE_BUILDER);
    registerEndpoint(url3);
    router.get(url3, async (req, res) => {
      const results = await pageBuilder.getPageBuilderPages();
      res.send(results);
    });
  } else {
    router.get(urlJoin(baseUrl, BASE_PATHS.PAGE_BUILDER), async (req, res) => {
      res.send([]);
    });
  }

  const url3 = urlJoin(baseUrl, 'settings');
  registerEndpoint(url3);
  router.get(url3, async (req, res) => {
    const settings = settingsStore.getConfig();
    res.send(settings);
  });

  const url4 = urlJoin(baseUrl, 'design-tokens');
  registerEndpoint(url4);
  router.get(url4, (req, res) => {
    res.send(tokens.getTokens());
  });

  const url5 = urlJoin(baseUrl, 'meta');
  registerEndpoint(url5);
  router.get(url5, (req, res) => {
    res.send(meta);
  });

  {
    const url = urlJoin(baseUrl, 'loading');
    registerEndpoint(url);
    router.get(url, (req, res) => {
      res.send(`<p>Loading...</p>`);
    });
  }

  const url6 = urlJoin(baseUrl, 'permissions');
  registerEndpoint(url6);
  router.get(url6, (req, res) => {
    const role = getRole(req);
    res.send(role.permissions);
  });

  // const url7 = urlJoin(baseUrl, 'upload');
  // registerEndpoint(url7);
  // router.post(url7, (req, res) => {
  //   const role = getRole(req);
  //   const canWrite = role.permissions.includes(PERMISSIONS.WRITE);
  //   if (!canWrite) {
  //     res.status(403).send({
  //       ok: false,
  //       message:
  //         'You do not have write permissions so you cannot upload any file',
  //     });
  //   } else {
  //   }
  // });

  return router;
}
