const { join } = require('path');
const { DesignTokens } = require('../design-tokens');
const { tokenGroups } = require('../../lib/constants');

const tokens = new DesignTokens({
  tokenPath: join(__dirname, './fixtures/tokens/tokens.yml'),
  tokenGroups,
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
