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
const { DesignTokens } = require('../design-tokens');

const tokens = new DesignTokens({
  data: {
    tokens: [
      {
        name: 'color-neutral-gray-base',
        value: '#ccc',
        comment: 'a light grey for your use',
        category: 'color',
        tags: ['neutral'],
      },
      {
        name: 'color-neutral-gray-light',
        value: '#bbb',
        comment: 'a light grey for your use',
        category: 'color',
        tags: ['neutral'],
      },
      {
        name: 'color-primary-blue-base',
        value: 'blue',
        comment: 'a blue for your use',
        category: 'color',
        tags: ['primary'],
      },
      {
        name: 'size-medium',
        value: '5px',
        comment: 'a medium space for your use',
        category: 'size',
        tags: [],
      },
    ],
  },
});

describe('DesignTokens', () => {
  test('getTokens', () => {
    const [aToken] = tokens.getTokens();
    expect(aToken).toHaveProperty('category');
    expect(aToken).toHaveProperty('value');
    expect(aToken).toHaveProperty('name');
  });
});
