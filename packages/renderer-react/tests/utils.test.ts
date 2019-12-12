import test from 'ava';
import { getUsage } from '../dist/utils';

test('renderer-react usage template a', async t => {
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

  t.snapshot(actual);
});

test('renderer-react usage template b', async t => {
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

  t.snapshot(actual);
});
