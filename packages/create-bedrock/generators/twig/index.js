const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const { join } = require('path');

const store = memFs.create();
const fs = editor.create(store);

async function twigGen(options) {
  console.log('twig generate starting...');

  fs.copyTpl(join(__dirname, 'templates'), options.dir, options);

  fs.commit(() => {
    console.log('files written');
  });
}

module.exports = twigGen;
