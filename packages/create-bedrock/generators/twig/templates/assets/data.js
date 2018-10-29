const fs = require('fs-extra');
const path = require('path');

const examplesDir = path.join(__dirname, 'examples');
const getPath = id => path.join(examplesDir, `${id}.json`);

/**
 * Get Example
 * @param {string} id - ID of Example to get
 * @return {Object} - Data for the Example
 */
async function getExample(id) {
  const fileString = await fs.readFile(getPath(id), 'utf8');
  return JSON.parse(fileString);
}

async function getExamples() {
  const files = await fs.readdir(examplesDir);
  const filePaths = files
    .filter(filePath => filePath.endsWith('json'))
    .map(filePath => path.join(examplesDir, filePath));

  return Promise.all(
    filePaths.map(async filePath => {
      const fileString = await fs.readFile(filePath, 'utf8');
      return JSON.parse(fileString);
    }),
  );
}

async function setExample(id, data) {
  await fs.writeFile(getPath(id), JSON.stringify(data, null, '  '));
  return {
    ok: true,
    message: `Example ${id} saved successfully!`,
  };
}

/**
 * @returns {Array<Object>} - An array of Spacings
 */
async function getSpacings() {
  return [
    {
      name: 's',
      value: '8px',
    },
    {
      name: 'm',
      value: '16px',
    },
    {
      name: 'l',
      value: '32px',
    },
  ];
}

module.exports = {
  getSpacings,
  getExample,
  getExamples,
  setExample,
};
