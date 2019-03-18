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

module.exports = {
  nowGet,
};
