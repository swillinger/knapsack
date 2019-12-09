import { formatCode } from '@knapsack/app/dist/server/server-utils';
import { getUsage } from '../src/utils';

describe('renderer-react usage template', () => {
  test('a', async () => {
    const actual = await getUsage({
      templateName: 'Button',
      props: {
        type: 'primary',
        isDark: true,
        data: [
          {
            first: 'John',
            last: 'Doe',
          },
          {
            first: 'Jane',
            last: 'Doe',
          },
        ],
      },
      children: 'Some Text',
      format: true,
    });

    expect(actual).toMatchSnapshot();
  });

  test('b', async () => {
    const actual = await getUsage({
      templateName: 'Button',
      props: {
        type: 'primary',
        isDark: true,
      },
      children: 'Click me',
      extraProps: [
        {
          key: 'icon',
          value: '<Icon type="add" />',
        },
        {
          key: 'handleClick',
          value: '() => {console.log("Clicked!")}',
        },
      ],
      format: true,
    });

    expect(actual).toMatchSnapshot();
  });
});
