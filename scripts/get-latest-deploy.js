#!/usr/bin/env node
// Outputs the latest now.sh deploy
const { getLatestDeploy } = require('./now-util');

// first arg, the `name` from `now.json`
const projectId = process.argv[2];

getLatestDeploy({ projectId })
  .then(url => {
    process.stdout.write(url);
  })
  .catch(error => {
    process.stderr.write(error.message);
    process.exit(1);
  });
