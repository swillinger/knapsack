/**
 *  Copyright (C) 2018 Basalt
    This file is part of Bedrock.
    Bedrock is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Bedrock is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Bedrock; if not, see <https://www.gnu.org/licenses>.
 */
const express = require('express');
const urlJoin = require('url-join');
const fs = require('fs-extra');
const md = require('marked');
const highlight = require('highlight.js');
const qs = require('qs');
const log = require('../cli/log');
const {
  BASE_PATHS,
  // PERMISSIONS
} = require('../lib/constants');
const { enableUiSettings } = require('../lib/features');
const { getRole } = require('./auth');

const router = express.Router();

// https://marked.js.org/#/USING_ADVANCED.md
md.setOptions({
  highlight: code => highlight.highlightAuto(code).value,
});

/**
 * Parse QueryString, decode non-strings
 * Changes strings like `'true'` to `true` amoung others like numbers
 * @param {string} querystring
 * @return {Object}
 */
function qsParse(querystring) {
  return qs.parse(querystring, {
    // This custom decoder is for turning values like `foo: "true"` into `foo: true`, along with Integers, null, and undefined.
    // https://github.com/ljharb/qs/issues/91#issuecomment-437926409
    decoder(str, decoder, charset) {
      const strWithoutPlus = str.replace(/\+/g, ' ');
      if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
      }

      if (/^(\d+|\d*\.\d+)$/.test(str)) {
        return parseFloat(str);
      }

      const keywords = {
        true: true,
        false: false,
        null: null,
        undefined,
      };
      if (str in keywords) {
        return keywords[str];
      }

      // utf-8
      try {
        return decodeURIComponent(strWithoutPlus);
      } catch (e) {
        return strWithoutPlus;
      }
    },
  });
}

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

  if (patternManifest) {
    const url = urlJoin(config.baseUrl, '/render');
    registerEndpoint(url, 'GET');
    router.get(url, async (req, res) => {
      const { query } = req;
      const {
        patternId,
        templateId,
        data: dataString = '{}',
        isInIframe: isInIframeString = 'false',
        wrapHtml: wrapHtmlString = 'true',
        assetSetId,
      } = query;
      const data = qsParse(dataString);
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
