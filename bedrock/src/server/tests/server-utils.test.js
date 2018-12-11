/**
 *  Copyright (C) 2018 Basalt
    This file is part of Bedrock.
    Bedrock is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Bedrock is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Bedrock; if not, see <https://www.gnu.org/licenses>.
 */
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
