const fetch = require('node-fetch');
const qs = require('querystring');
const http = require('https');

const { ZEIT_TOKEN } = process.env;

if (!ZEIT_TOKEN) {
  console.log('Missing env var: ZEIT_TOKEN');
  process.exit(1);
}

/**
 * @param {string} path
 * @return {Promise<any>}
 */
function nowGet(path) {
  // eslint-disable-next-line
  return new Promise((resolve, reject) => {// @todo implement `reject()`
    const options = {
      method: 'GET',
      hostname: 'api.zeit.co',
      path: `${path}?teamId=team_ZFymjd1fbNFF09iW4dCtFEep`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ZEIT_TOKEN}`,
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
    // req.write(JSON.stringify(requestBody));
    req.end();
  });
}

/**
 * @link https://zeit.co/docs/api/v1/#endpoints/deployments/list-all-the-deployments
 * @param {object} opt
 * @param {string} [opt.projectId] - the `name` in `now.json`
 * @return {Promise<string>} - URL of latest deploymennt
 */
function getLatestDeploy({ projectId } = {}) {
  return new Promise((resolve, reject) => {
    const query = {
      teamId: 'team_ZFymjd1fbNFF09iW4dCtFEep', // basalt
    };
    fetch(`https://api.zeit.co/v5/now/deployments?${qs.stringify(query)}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${ZEIT_TOKEN}`,
      },
    })
      .then(async res => {
        const results = await res.json();
        if (!res.ok) {
          process.stderr.write(
            `Error getting latest now.sh deploy: ${res.message}`,
          );
          process.exit(1);
        }
        return results;
      })
      .then(({ deployments }) => {
        if (deployments.length === 0) {
          reject(new Error('Zero deployments returned'));
        }
        const theseDeploys = projectId
          ? deployments.filter(d => d.name === projectId)
          : deployments;
        theseDeploys.sort(function(a, b) {
          // Turn created unix time strings into dates, and then sort by what happened most recently
          return new Date(a.created) + new Date(b.created);
        });

        const [deployment] = theseDeploys;

        if (deployment && deployment.url) {
          resolve(`https://${deployment.url}`);
        } else {
          reject(new Error('No deployments found'));
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

module.exports = {
  getLatestDeploy,
  nowGet,
};
