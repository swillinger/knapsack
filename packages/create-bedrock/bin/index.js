#!/usr/bin/env node
const program = require('commander');
const { join } = require('path');
const init = require('../lib/init');
const { version } = require('../package.json');

console.log(`Creating Bedrock with v${version}...`);
program
  .version(version)
  .option('--force', 'Overwrite existing files')
  .parse(process.argv);

// console.log({
//   args: program.args,
//   force: program.force,
// });

// process.exit(0);
const [name] = program.args;

if (!name) {
  console.error('Uh oh: pass in name as first arg');
  process.exit(1);
}

init({
  // @todo enable options passed in from cli
  name,
  dir: join(process.cwd(), name),
  bedrockVersion: version,
  force: program.force,
}).then(() => console.log('all done'));
