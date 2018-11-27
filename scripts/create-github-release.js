#! /usr/bin/env node
const http = require('https');
const inquirer = require('inquirer');

const { GITHUB_TOKEN } = process.env;

// https://developer.github.com/v3/repos/releases/#create-a-release

inquirer
  .prompt([
    {
      name: 'tag',
    },
    {
      name: 'body',
      type: 'editor',
    },
  ])
  .then(({ tag, body }) => {
    const options = {
      method: 'POST',
      hostname: 'api.github.com',
      path: '/repos/basaltinc/bedrock/releases',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Cache-Control': 'no-cache',
        'User-Agent': 'EvanLovely',
      },
    };

    const req = http.request(options, res => {
      const chunks = [];

      res.on('data', chunk => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const responseBody = Buffer.concat(chunks);
        console.log(responseBody.toString());
      });
    });

    const requestBody = {
      tag_name: tag,
      target_commitish: 'master',
      name: tag,
      body,
      draft: false,
      prerelease: false,
    };
    // console.log({ requestBody });
    req.write(JSON.stringify(requestBody));
    req.end();
  });
