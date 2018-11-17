const express = require('express');
const urlJoin = require('url-join');
const fs = require('fs-extra');
const { join, relative } = require('path');
const md = require('marked');
const highlight = require('highlight.js');
const { wrapHtml } = require('./templates');
const { USER_SITE_PUBLIC } = require('../lib/constants');
const { enableUiSettings } = require('../lib/features');

const router = express.Router();

// https://marked.js.org/#/USING_ADVANCED.md
md.setOptions({
  highlight: code => highlight.highlightAuto(code).value,
});

function getRoutes(config) {
  const {
    registerEndpoint,
    patternManifest,
    exampleStore,
    settingsStore,
  } = config;

  router.get(config.baseUrl, (req, res) => {
    res.json({
      ok: true,
      message: 'Welcome to the API!',
    });
  });

  if (config.designTokens) {
    config.designTokens.forEach(designToken => {
      const url = urlJoin(config.baseUrl, 'design-token', designToken.id);
      // console.log(`Setting up "${url}" api endpoint...`);
      registerEndpoint(url);
      router.get(url, async (req, res) => {
        try {
          const tokens = await designToken.get(req.query);
          // console.log(`Responding on "${url}" api endpoint with: `, tokens);
          res.send({
            ok: true,
            data: tokens,
          });
        } catch (err) {
          res.send({
            ok: false,
            message: err.toString(),
          });
        }
      });
    });

    const url2 = urlJoin(config.baseUrl, 'design-tokens');
    registerEndpoint(url2);
    router.get(url2, async (req, res) => {
      res.send(config.designTokens);
    });
  }

  if (config.templateRenderers) {
    const url = urlJoin(config.baseUrl, '/render');
    // console.log(`Setting up "${url}" api endpoint...`);
    registerEndpoint(url, 'POST');
    router.post(url, async (req, res) => {
      const { body } = req;
      const { type } = req.query;
      if (!type) {
        console.error('Error: not enough info to render template');
        res.status(400).send({
          ok: false,
          message: 'Request not formatted correctly.',
        });
      }

      const {
        /** @type {string} */
        template,
        /** @type {Object} */
        data,
      } = body;

      const renderer = config.templateRenderers.find(t => t.test(template));
      // const renderer = config.templateRenderers.find(t => t.test(template));
      if (!renderer) {
        console.error(
          'Error: no template renderer found to handle this template',
        );
        res.status(400).send({
          ok: false,
          message: 'No template renderer found to handle this template',
        });
      }

      let results;
      switch (type) {
        case 'renderString':
          results = await renderer.renderString(template, data);
          break;
        case 'renderFile':
          results = await renderer.render(template, data);
          break;
        default:
          results = {
            ok: false,
            message: 'No valid "type" of request sent.',
          };
      }

      // @todo allow query param on API request to toggle
      const wrapHtmlResults = true;
      if (results.ok && wrapHtmlResults) {
        const cssUrls = config.css
          ? config.css.map(css =>
              join(USER_SITE_PUBLIC, relative(config.public, css)),
            )
          : [];
        const jsUrls = config.js
          ? config.js.map(js =>
              join(USER_SITE_PUBLIC, relative(config.public, js)),
            )
          : [];
        results.html = wrapHtml(results.html, cssUrls, jsUrls);
      }

      res.json(results);
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

  if (exampleStore) {
    const url1 = urlJoin(config.baseUrl, '/example/:id');
    registerEndpoint(url1);
    router.get(url1, async (req, res) => {
      try {
        const example = await exampleStore.getExample(req.params.id);
        res.send({
          ok: true,
          example,
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

    const url2 = urlJoin(config.baseUrl, '/example/:id');
    registerEndpoint(url2, 'POST');
    router.post(url2, async (req, res) => {
      const results = await exampleStore.setExample(req.params.id, req.body);
      res.send(results);
    });

    const url3 = urlJoin(config.baseUrl, '/examples');
    registerEndpoint(url3);
    router.get(url3, async (req, res) => {
      const results = await exampleStore.getExamples();
      res.send(results);
    });
  } else {
    router.get(urlJoin(config.baseUrl, '/examples'), async (req, res) => {
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

  const url2 = urlJoin(config.baseUrl, 'sections');
  registerEndpoint(url2);
  router.get(url2, async (req, res) => {
    const { sections = [] } = config;
    res.send(sections);
  });

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

  return router;
}

module.exports = {
  getRoutes,
};
