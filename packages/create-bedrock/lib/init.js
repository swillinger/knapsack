// const inquirer = require('inquirer');
// const del = require('del');
const { existsSync, mkdir } = require('fs-extra');
const simpleGen = require('../generators/simple');

// const GENERATORS = {
//   twig: 'twig',
// };

async function init(options) {
  if (existsSync(options.dir)) {
    console.error('Uh oh, that directory already exists: ', options.dir);
    process.exit(1);
  }
  await mkdir(options.dir);
  // console.log('init start');
  // if (options.force) {
  //   await del(['**', '.*']);
  // }
  // const answers = await inquirer.prompt([
  //   {
  //     type: 'input',
  //     name: 'name',
  //     default: 'my-awesome-design-system',
  //     filter: input => input.toLowerCase().replace(/ /g, '-'),
  //   },
  //   {
  //     type: 'list',
  //     name: 'generator',
  //     choices: Object.keys(GENERATORS),
  //   },
  // ]);

  // console.log({ answers });

  // switch (answers.generator) {
  //   case GENERATORS.twig:
  //     return twigGen(answers);
  //   default:
  //     console.log('uh oh, no good generator selected...');
  //     process.exit(1);
  // }
  // return twigGen(options);
  return simpleGen(options);
}

module.exports = init;
