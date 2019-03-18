const http = require('https');

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
        Accept: [
          'application/vnd.github.v3+json',
          'application/vnd.github.ant-man-preview+json',
          'application/vnd.github.flash-preview+json',
        ].join(', '),
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
 * @param {number} issue
 * @param {string} comment
 * @return {Promise<any>}
 * @link https://developer.github.com/v3/issues/comments/#create-a-comment
 */
async function commentOnIssue(issue, comment) {
  return githubPost(`/repos/basaltinc/bedrock/issues/${issue}/comments`, {
    body: comment,
  });
}

/**
 *
 * @param {string} changelog - markdown string from a CHANGELOG
 * @returns {{ issues: number[] }}
 */
function parseChangelog(changelog) {
  const [, ...others] = changelog.split('bedrock/issues/');
  const issueResults = new Set(
    others.map(item => parseInt(item.match(/^\d*/)[0], 10)),
  );
  return {
    issues: [...issueResults],
  };
}

module.exports = {
  githubPost,
  createRelease,
  commentOnIssue,
  parseChangelog,
};
