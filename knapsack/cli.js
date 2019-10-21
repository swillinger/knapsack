#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const currentNodeVersion = process.versions.node;
const majorNodeVersion = parseInt(currentNodeVersion.split('.')[0], 10);

// The minimum we want is node v8.9.0 which is LTS Carbon, released Oct 2017
if (majorNodeVersion < 10) {
  console.error(
    `You are running Node ${currentNodeVersion} and this requires Node 10 or higher. Please update your version of Node: https://nodejs.org/en/`,
  );
  process.exit(1);
}

const cliFile = path.join(__dirname, './dist/cli/knapsack-cli.js');
const clientIndexFile = path.join(__dirname, './dist/client/index.html');

if (!fs.existsSync(cliFile) || !fs.existsSync(clientIndexFile)) {
  console.error(
    'The main cli entry file for Knapsack does not exists, which probably means that it was not built and you are developing Knapsack, so please run "yarn build" in this folder:',
  );
  console.error(__dirname);
  process.exit(1);
}

require(cliFile);
