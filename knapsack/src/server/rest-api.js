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
const express = require('express');
const urlJoin = require('url-join');
const fs = require('fs-extra');
const md = require('marked');
const highlight = require('highlight.js');
const { qsParse } = require('./server-utils');
const { MemDb } = require('./db');
const log = require('../cli/log');
const {
  BASE_PATHS,
  // PERMISSIONS
} = require('../lib/constants');
const { enableUiSettings } = require('../lib/features');
const { getRole } = require('./auth');

const router = express.Router();
const memDb = new MemDb();

// https://marked.js.org/#/USING_ADVANCED.md
md.setOptions({
  highlight: code => highlight.highlightAuto(code).value,
});

function getRoutes(config) {
  const {
    registerEndpoint,
    patternManifest,
    pageBuilder,
    settingsStore,
    meta: { websocketsPort },
  } = config;

  router.get(config.baseUrl, (req, res) => {
    res.json({
      ok: true,
      message: 'Welcome to the API!',
    });
  });

  {
    const url = urlJoin(config.baseUrl, 'data');
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
    const url = urlJoin(config.baseUrl, '/render');
    registerEndpoint(url, 'GET');
    router.get(url, async (req, res) => {
      const { query } = req;
      const {
        patternId,
        templateId,
        data: dataString,
        isInIframe: isInIframeString = 'false',
        wrapHtml: wrapHtmlString = 'true',
        assetSetId,
        demoDataIndex,
        dataId,
      } = query;

      const dataApproaches = [dataString, demoDataIndex, dataId].filter(Boolean)
        .length;
      if (dataApproaches > 1) {
        const msg = `Error: trying to render using multiple data sources, choose one.`;
        log.error(msg, { query });
        res.send(`<p>${msg}</p>`);
        return;
      }

      let data = dataString ? qsParse(dataString) : dataString;
      if (dataId) {
        data = memDb.getData(dataId);
      }
      const isInIframe = isInIframeString === 'true';
      const wrapHtml = wrapHtmlString === 'true';

      const results = await patternManifest.render({
        patternId,
        templateId,
        data,
        wrapHtml,
        isInIframe,
        websocketsPort,
        assetSetId,
        demoDataIndex: demoDataIndex ? parseInt(demoDataIndex, 10) : null,
      });

      if (results.ok) {
        res.send(results.html);
      } else {
        log.error(`Error rendering template`, {
          patternId,
          templateId,
          data,
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
    const url1 = urlJoin(config.baseUrl, 'pattern/:id');
    registerEndpoint(url1);
    router.get(url1, async (req, res) => {
      const results = await patternManifest.getPattern(req.params.id);
      res.send(results);
    });

    const url2 = urlJoin(config.baseUrl, 'patterns');
    registerEndpoint(url2);
    router.get(url2, async (req, res) => {
      const results = await patternManifest.getPatterns();
      res.send(results);
    });

    const url3 = urlJoin(config.baseUrl, 'pattern-meta/:id');
    registerEndpoint(url3);
    router.get(url3, async (req, res) => {
      const results = await patternManifest.getPatternMeta(req.params.id);
      res.send(results);
    });

    const url4 = urlJoin(config.baseUrl, 'pattern-meta/:id');
    registerEndpoint(url4, 'POST');
    router.post(url4, async (req, res) => {
      const results = await patternManifest.setPatternMeta(
        req.params.id,
        req.body,
      );
      res.send(results);
    });

    const url5 = urlJoin(config.baseUrl, 'new-pattern');
    registerEndpoint(url5, 'POST');
    router.post(url5, async (req, res) => {
      const results = await patternManifest.createPatternFiles(req.body);
      res.send(results);
    });
  }

  if (pageBuilder) {
    const url1 = urlJoin(config.baseUrl, `${BASE_PATHS.PAGES}/:id`);
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

    const url2 = urlJoin(config.baseUrl, `${BASE_PATHS.PAGES}/:id`);
    registerEndpoint(url2, 'POST');
    router.post(url2, async (req, res) => {
      const results = await pageBuilder.setPageBuilderPage(
        req.params.id,
        req.body,
      );
      res.send(results);
    });

    const url3 = urlJoin(config.baseUrl, BASE_PATHS.PAGES);
    registerEndpoint(url3);
    router.get(url3, async (req, res) => {
      const results = await pageBuilder.getPageBuilderPages();
      res.send(results);
    });
  } else {
    router.get(urlJoin(config.baseUrl, BASE_PATHS.PAGES), async (req, res) => {
      res.send([]);
    });
  }

  if (config.sections) {
    config.sections.forEach(section => {
      const url = urlJoin(config.baseUrl, `section/${section.id}/:id`);
      registerEndpoint(url);
      router.get(url, async (req, res) => {
        const item = section.items.find(x => x.id === req.params.id);
        if (!item) {
          res.send({
            ok: false,
            message: `Item ${req.params.id} not found`,
          });
        }
        const contents = await fs.readFile(item.src, 'utf8');
        const isMarkdown = item.src.endsWith('.md');
        res.send({
          ok: true,
          data: {
            ...item,
            contents: isMarkdown ? md(contents) : contents,
          },
        });
      });
    });
  }

  const url3 = urlJoin(config.baseUrl, 'settings');
  registerEndpoint(url3);
  router.get(url3, async (req, res) => {
    const settings = settingsStore.getSettings();
    res.send(settings);
  });

  if (enableUiSettings) {
    const url4 = urlJoin(config.baseUrl, 'settings');
    registerEndpoint(url4, 'POST');
    router.post(url4, async (req, res) => {
      const results = settingsStore.setSettings(req.body);
      res.send(results);
    });
  }

  const url5 = urlJoin(config.baseUrl, 'meta');
  registerEndpoint(url5);
  router.get(url5, (req, res) => {
    res.send(config.meta);
  });

  {
    const url = urlJoin(config.baseUrl, 'loading');
    registerEndpoint(url);
    router.get(url, (req, res) => {
      res.send(`<p>Loading...</p>`);
    });
  }

  const url6 = urlJoin(config.baseUrl, 'permissions');
  registerEndpoint(url6);
  router.get(url6, (req, res) => {
    const role = getRole(req);
    res.send(role.permissions);
  });

  // const url7 = urlJoin(config.baseUrl, 'upload');
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

module.exports = {
  getRoutes,
};
