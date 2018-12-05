const { join } = require('path');
const { DesignTokens } = require('../design-tokens');

const tokens = new DesignTokens({
  tokenPath: join(__dirname, './fixtures/tokens/tokens.yml'),
  tokenGroups: [
    {
      id: 'colors',
      title: 'Colors',
      description: 'Some colors',
      tokenCategoryIds: ['background-color', 'text-color', 'hr-color'],
    },
    {
      id: 'sizing',
      title: 'Sizing',
      description: 'Some sizing',
      tokenCategoryIds: ['spacing', 'media-query'],
    },
    {
      id: 'typography',
      title: 'Typography',
      description: 'Some typography',
      tokenCategoryIds: [
        'font-family',
        'font-size',
        'line-height',
        'text-color',
        'text-shadow',
      ],
    },
    {
      id: 'shadows',
      title: 'Shadows',
      description: 'Some shadows',
      tokenCategoryIds: ['box-shadow', 'inner-shadow', 'text-shadow'],
    },
  ],
});

describe('DesignTokens', () => {
  test('isCategoryUsed', () => {
    expect(tokens.isCategoryUsed('box-shadow')).toBe(true);
    expect(tokens.isCategoryUsed('blah')).toBe(false);
  });

  test('getTokens', () => {
    const [aToken] = tokens.getTokens();
    expect(aToken).toHaveProperty('type');
    expect(aToken).toHaveProperty('category');
    expect(aToken).toHaveProperty('value');
    expect(aToken).toHaveProperty('originalValue');
    expect(aToken).toHaveProperty('name');
  });
});

describe('Design Token Format Convert', () => {
  const someTokens = [
    {
      name: 'c-gray',
      value: 'rgb(216, 216, 218)',
      category: 'background-color',
      comment: null,
      originalValue: '{!gray}',
      type: 'color',
    },
    {
      name: 'c-blue--light',
      value: 'rgb(207, 227, 222)',
      category: 'background-color',
      comment: null,
      originalValue: '{!blue_light}',
      type: 'color',
    },
  ];

  test('custom-properties.css', async () => {
    const results = await tokens.convertTokensFormat(
      someTokens,
      'custom-properties.css',
    );
    const expected = `
:root {
  --c-gray: rgb(216, 216, 218);
  --c-blue-light: rgb(207, 227, 222);
}
    `;
    expect(results.trim()).toBe(expected.trim());
  });

  test('scss', async () => {
    const results = await tokens.convertTokensFormat(someTokens, 'scss');
    const expected = `
$c-gray: rgb(216, 216, 218);
$c-blue-light: rgb(207, 227, 222);
    `;
    expect(results.trim()).toBe(expected.trim());
  });

  test('convert all formats and not fail', async () => {
    const results = await tokens.convertTokensFormat(
      tokens.getTokens(),
      'scss',
    );
    // @todo improve test; just making sure converting all tokens doesn't fail for now
    expect(results.length > 0).toBe(true);
  });
});
