import { formatCode } from '@knapsack/app/dist/server/server-utils';
import { getUsage } from './utils';

const format = code => formatCode({ code, language: 'html' });

describe('renderer-web-components usage template', () => {
  test('a', async () => {
    const actual = await getUsage({
      templateName: 'my-button',
      props: {
        url: '#',
        'is-dark': true,
      },
      children: `Click me`,
    });

    const expected = `
<my-button url="#" is-dark>
  Click me
</my-button>`;

    expect(format(actual)).toBe(format(expected));
  });
});
