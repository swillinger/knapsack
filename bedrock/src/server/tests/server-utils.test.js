const { join } = require('path');
const { findReadmeInDir, findReadmeInDirSync } = require('../server-utils');

describe('server-utils', () => {
  test('findReadmeInDir', async () => {
    const dir = join(__dirname, './fixtures/patterns/card');
    const actual = await findReadmeInDir(dir);
    expect(actual).toEqual(join(dir, 'readme.md'));
    const actual2 = await findReadmeInDirSync(dir);
    expect(actual2).toEqual(join(dir, 'readme.md'));
  });
});
