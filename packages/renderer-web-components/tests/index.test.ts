import test from 'ava';
import { formatCode } from '@knapsack/app/dist/server/server-utils';
import { getUsage } from '../dist/utils';

const format = code => formatCode({ code, language: 'html' });

test('renderer-web-components usage template a', async t => {
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

  t.is(format(actual), format(expected));
});
