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
import fs from 'fs-extra';
import { isAbsolute, join, relative } from 'path';
import { exec } from 'child_process';
import highlight from 'highlight.js';
import * as Files from '../schemas/api/files';
import { endpoint as pluginsEndpoint } from '../schemas/api/plugins';
import { handlePluginsEndpoint } from './api/plugins';
import { MemDb } from './dbs/mem-db';
import * as log from '../cli/log';
import { BASE_PATHS, HTTP_STATUS } from '../lib/constants';
import { getUserInfo } from './auth';
import { KnapsackBrain, KnapsackConfig } from '../schemas/main-types';
import { KnapsackMeta } from '../schemas/misc';
import { KnapsackTemplateDemo } from '../schemas/patterns';
import { KsRenderResults } from '../schemas/knapsack-config';
import { fileExists, resolvePath } from './server-utils';
import { getFeaturesForUser } from '../lib/features';

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
  config,
}: {
  patternManifest: KnapsackBrain['patterns'];
  config: KnapsackBrain['config'];
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

  router.post(pluginsEndpoint, handlePluginsEndpoint);

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
    async function render({
      patternId,
      templateId,
      assetSetId,
      isInIframe,
      dataId,
    }: {
      patternId: string;
      templateId: string;
      assetSetId?: string;
      /**
       * Data id from `saveData()`
       */
      dataId?: string;
      /**
       * Will this be in an iFrame?
       */
      isInIframe?: boolean;
    }): Promise<KsRenderResults> {
      const demo = dataId ? memDb.getData(dataId) : null;
      try {
        const results = patternManifest.render({
          patternId,
          templateId,
          demo,
          isInIframe,
          websocketsPort: meta.websocketsPort,
          assetSetId,
          // demoDataId,
        });
        return results;
      } catch (e) {
        return {
          ok: false,
          html: `<p>${e.message}</p>`,
          wrappedHtml: `<p>${e.message}</p>`,
          message: e.message,
        };
      }
    }

    const url = urlJoin(baseUrl, '/render');
    registerEndpoint(url, 'GET');
    registerEndpoint(url, 'POST');
    router.post(url, async (req, res) => {
      const { body } = req;
      if (!('patternId' in body && 'templateId' in body)) {
        res.send({
          ok: false,
        });
      } else {
        const results = await render(body);
        res.send(results);
      }
    });
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
      const isInIframe = isInIframeString === 'true';
      const wrapHtml = wrapHtmlString === 'true';

      const results = await render({
        patternId,
        templateId,
        assetSetId,
        dataId,
        isInIframe,
      });

      if (results.ok) {
        res.send(wrapHtml ? results.wrappedHtml : results.html);
      } else {
        log.error(`Error rendering template`, {
          patternId,
          templateId,
          dataId,
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

    {
      const url = Files.endpoint;
      registerEndpoint(url);
      router.post(url, async (req, res) => {
        const userInfo = getUserInfo(req);
        const { isLocalDev } = getFeaturesForUser(userInfo);
        if (!isLocalDev) {
          return res.status(HTTP_STATUS.BAD.BAD_REQUEST).send({
            ok: false,
            message: 'This endpoint only available to local developers',
          });
        }

        let response: Files.ActionResponses;
        const reqBody: Files.Actions = req.body;
        const { data: dataDir } = config;

        switch (reqBody.type) {
          case Files.ACTIONS.verify: {
            const { path } = reqBody.payload;
            const { exists, absolutePath } = resolvePath({
              path,
              resolveFromDirs: [dataDir],
            });

            response = {
              type: Files.ACTIONS.verify,
              payload: {
                exists,
                relativePath: exists ? relative(dataDir, absolutePath) : '',
                absolutePath,
              },
            };
            break;
          }
          case Files.ACTIONS.saveTemplateDemo: {
            const { patternId, templateId, demoId, code } = reqBody.payload;
            const fullPath = patternManifest.getTemplateDemoAbsolutePath({
              patternId,
              templateId,
              demoId,
            });

            try {
              await fs.writeFile(fullPath, code, 'utf8');
              response = {
                type: Files.ACTIONS.saveTemplateDemo,
                payload: {
                  ok: true,
                },
              };
            } catch (e) {
              response = {
                type: Files.ACTIONS.saveTemplateDemo,
                payload: {
                  ok: false,
                  message: e.message,
                },
              };
            }
            break;
          }
          case Files.ACTIONS.deleteTemplateDemo: {
            const { path } = reqBody.payload;
            const { exists, absolutePath } = resolvePath({
              path,
              resolveFromDirs: [dataDir],
            });
            if (!exists) {
              response = {
                type: Files.ACTIONS.deleteTemplateDemo,
                payload: {
                  ok: false,
                  message: 'File already did not exist',
                },
              };
            } else {
              try {
                await fs.remove(absolutePath);
                response = {
                  type: Files.ACTIONS.deleteTemplateDemo,
                  payload: {
                    ok: true,
                  },
                };
              } catch (e) {
                log.error('Files.ACTIONS.deleteTemplateDemo', e, '/api/files');
                response = {
                  type: Files.ACTIONS.deleteTemplateDemo,
                  payload: {
                    ok: false,
                    message: e.message,
                  },
                };
              }
            }

            break;
          }

          case Files.ACTIONS.openFile: {
            const { filePath } = reqBody.payload;
            const { exists, absolutePath } = resolvePath({
              path: filePath,
              resolveFromDirs: [dataDir],
            });
            if (exists) {
              exec(`open ${absolutePath}`, err => {
                if (err)
                  log.error(`error opening file: ${err.message}`, {
                    filePath,
                    err,
                  });
                response = {
                  type: Files.ACTIONS.openFile,
                  payload: {
                    ok: !err,
                    message: err ? err.message : '',
                  },
                };
              });
            }
          }
        }

        res.send(response);
      });
    }
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
    const settings = settingsStore.getData();
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
    const { role } = getUserInfo(req);
    res.send(role.permissions);
  });

  return router;
}
