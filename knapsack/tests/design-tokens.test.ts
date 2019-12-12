import test from 'ava';
import { DesignTokens } from '../dist/server/design-tokens';

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

test('DesignTokens getTokens', t => {
  const [aToken] = tokens.getTokens();
  t.is('category' in aToken, true);
  t.is('value' in aToken, true);
  t.is('name' in aToken, true);
});
