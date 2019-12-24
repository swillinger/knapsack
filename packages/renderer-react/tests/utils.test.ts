import test from 'ava';
import { join } from 'path';
import { KnapsackRendererBase } from '@knapsack/app';
import { KnapsackReactRenderer } from '../dist/renderer-react';
// eslint-disable-next-line import/extensions
import { getUsage, getReactDocs } from '../dist/utils.js';

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

test('inferDocs card.jsx with prop types', async t => {
  const cardPath = join(__dirname, './helpers/card.jsx');
  const spec = await getReactDocs({
    src: cardPath,
    exportName: 'Card',
  });

  const { ok, message } = KnapsackRendererBase.validateSpec(spec);
  // console.log(JSON.stringify(spec, null, '  '));

  if (!ok) {
    console.log(message);
  }

  t.is(ok, true);
});

test('inferDocs card.tsx with types', async t => {
  const cardPath = join(__dirname, './helpers/card.tsx');
  const spec = await getReactDocs({
    src: cardPath,
    exportName: 'Card',
  });

  // console.log(JSON.stringify(spec, null, '  '));

  const { ok, message } = KnapsackRendererBase.validateSpec(spec);

  if (!ok) {
    console.log(message);
  }

  t.is(ok, true);
});
