#! /usr/bin/env node
const http = require('https');
const inquirer = require('inquirer');

const { GITHUB_TOKEN } = process.env;

/**
 * @param {string} path
 * @param {Object} requestBody
 * @return {Promise<any>}
 */
function githubPost(path, requestBody) {
  // eslint-disable-next-line
  return new Promise((resolve, reject) => {// @todo implement `reject()`
    const options = {
      method: 'POST',
      hostname: 'api.github.com',
      path,
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
        resolve(JSON.parse(responseBody.toString()));
      });
    });

    // console.log({ requestBody });
    req.write(JSON.stringify(requestBody));
    req.end();
  });
}

/**
 * @param {string} tag
 * @param {string} body
 * @return {Promise<any>}
 * @link https://developer.github.com/v3/repos/releases/#create-a-release
 */
async function createRelease(tag, body) {
  await githubPost('/repos/basaltinc/bedrock/releases', {
    tag_name: tag,
    target_commitish: 'master',
    name: tag,
    body,
    draft: false,
    prerelease: false,
  });
}

/**
 * @param {string} issue
 * @param {string} comment
 * @return {Promise<any>}
 * @link https://developer.github.com/v3/issues/comments/#create-a-comment
 */
async function commentOnIssue(issue, comment) {
  await githubPost(`/repos/basaltinc/bedrock/issues/${issue}/comments`, {
    body: comment,
  });
}

inquirer
  .prompt([
    {
      name: 'tag',
    },
    {
      name: 'body',
      type: 'editor',
    },
    {
      name: 'issues',
      message: 'Issues closed in release (format: 42,12)',
      filter: a =>
        a
          .trim()
          .filter(Boolean)
          .split(','),
    },
  ])
  .then(async ({ tag, body, issues }) => {
    const releaseResults = await createRelease(tag, body);
    console.log(
      `👍 Released [${tag}](https://github.com/basaltinc/bedrock/releases/tag/${tag})`,
      releaseResults,
    );
    if (issues) {
      const issueResults = await Promise.all(
        issues.map(issue =>
          commentOnIssue(
            issue,
            `Released in [${tag}](https://github.com/basaltinc/bedrock/releases/tag/${tag})`,
          ),
        ),
      );
      issueResults.forEach(result => {
        console.log(`👍 Issue commented on: ${result.html_url}`);
      });
    }
  });
