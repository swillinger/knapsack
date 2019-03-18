#! /usr/bin/env node
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const { githubPost } = require('./github-util');
const { nowGet } = require('./now-util');

const { GITHUB_SHA } = process.env;

const example = process.argv[2];

if (!example) {
  console.log('No example passed in as first arg');
  process.exit(1);
}

const { name } = JSON.parse(
  readFileSync(join(__dirname, '../examples', example, 'now.json'), 'utf8'),
);

console.log({ GITHUB_SHA, example, name });

if (!name) {
  console.log(`No now.json name found`);
  process.exit(1);
}

async function go() {
  const nowResults = await nowGet('/v2/now/deployments').catch(err => {
    console.log(err);
    process.exit(1);
  });

  const { deployments } = nowResults;
  const theseDeploys = deployments.filter(d => d.name === name);
  //
  // console.log('----');
  // console.log('theseDeploys');
  // console.log(theseDeploys);
  // console.log('----');

  // @todo first `.sort` by `created`
  const [latestDeploy] = theseDeploys;

  if (latestDeploy.state !== 'READY') {
    console.log(
      `Uh oh, latest deploy state is not "READY", it is ${latestDeploy.state}`,
    );
    process.exit(1);
  }

  console.log('----');
  console.log('latestDeploy');
  console.log(latestDeploy);
  console.log('----');

  const { id } = await githubPost('/repos/basaltinc/bedrock/deployments', {
    ref: GITHUB_SHA,
    auto_merge: false,
    // description: '',
    required_contexts: [], // The status contexts to verify against commit status checks. If you omit this parameter, GitHub verifies all unique contexts before creating a deployment. To bypass checking entirely, pass an empty array. Defaults to all unique contexts.
    environment: name,
    transient_environment: false, // default `false` - Specifies if the given environment is specific to the deployment and will no longer exist at some point in the future.
    production_environment: false, // default `false` - Specifies if the given environment is one that end-users directly interact with
  }).catch(err => {
    console.log(err);
    process.exit(1);
  });

  console.log(`Deploy created with id: ${id}`);

  if (!id) {
    console.log('no id');
    process.exit(1);
  }

  // bedrock-example-bootstrap-qmskhenrxq.now.sh
  const deployUrl = `https://${latestDeploy.url}`;
  // qmskhenrxq
  const deployId = latestDeploy.url
    .replace(`${latestDeploy.name}-`, '')
    .replace('.now.sh', '');
  // https://zeit.co/basalt/bedrock-example-bootstrap/deployment/qmskhenrxq/logs
  const logUrl = `https://zeit.co/basalt/${
    latestDeploy.name
  }/deployment/${deployId}/logs`;

  console.log({
    deployUrl,
    deployId,
    logUrl,
  });

  const deployStatusResults = await githubPost(
    `/repos/basaltinc/bedrock/deployments/${id}/statuses`,
    {
      state: 'success',
      environment: name,
      log_url: logUrl,
      description: `Git Sha: ${GITHUB_SHA} Now Id: ${deployId}`,
      environment_url: deployUrl,
      auto_inactive: false,
    },
  ).catch(err => {
    console.log(err);
    process.exit(1);
  });

  console.log('----');
  console.log('deployStatusResults');
  console.log(deployStatusResults);
  console.log('----');

  if (deployStatusResults.state !== 'success') {
    console.log(
      `Uh oh! deployStatusResults.state is not 'success', it is ${
        deployStatusResults.state
      }`,
    );
    process.exit(1);
  }

  const artifactsDir = join(__dirname, '../.github/artifacts/');
  // if (!existsSync(artifactsDir)) {
  //   mkdirSync(artifactsDir);
  // }
  writeFileSync(join(artifactsDir, `now-url--${example}.txt`), deployUrl);
  console.log(`Wrote deploy url to "${join(artifactsDir, 'now-url.txt')}"`);
}

go();
