import { formatCode } from '@knapsack/app/dist/server/server-utils';
import { getUsage } from './utils';

describe('renderer-react usage template', () => {
  test('a', async () => {
    const actual = await getUsage({
      templateName: 'Button',
      props: {
        type: 'primary',
      },
      children: 'Some Text',
      format: true,
    });

    const expected = `
<Button type={'primary'}>
Some Text
</Button>
    `;
    const formattedExpected = formatCode({
      language: 'react',
      code: expected,
    });
    expect(actual).toBe(formattedExpected);
  });
});
