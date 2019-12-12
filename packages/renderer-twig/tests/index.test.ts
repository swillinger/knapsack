import test from 'ava';
import { getTwigUsage } from '../dist/utils';

test('renderer-twig twig usage template a', async t => {
  const actual = await getTwigUsage({
    templateName: '@components/button.twig',
    props: {
      title: 'A Button',
      isDark: true,
    },
  });

  const expected = `
{% include "@components/button.twig" with {
   title: "A Button",
   isDark: true,
} only %}
    `;

  t.is(actual.trim(), expected.trim());
});

test('renderer-twig twig usage template b', async t => {
  const actual = await getTwigUsage({
    templateName: '@components/button.twig',
    props: {
      title: 'A Button',
      isDark: true,
    },
    extraProps: [
      {
        key: 'footer',
        value: 'footer',
      },
    ],
  });

  const expected = `
{% include "@components/button.twig" with {
   title: "A Button",
   isDark: true,
   footer: footer,
} only %}
    `;

  t.is(actual.trim(), expected.trim());
});

test('renderer-twig twig usage template c', async t => {
  const actual = await getTwigUsage({
    templateName: '@components/button.twig',
    props: {
      title: 'A Button',
      isDark: true,
      tags: ['tag1', 'tag2', 'tag3'],
    },
  });

  const expected = `
{% include "@components/button.twig" with {
   title: "A Button",
   isDark: true,
   tags: ["tag1","tag2","tag3"],
} only %}
    `;
  t.is(actual.trim(), expected.trim());
});

test('renderer-twig twig usage template d', async t => {
  const actual = await getTwigUsage({
    templateName: '@components/button.twig',
    props: {
      title: 'A Button',
      isDark: true,
      buttons: [
        {
          title: 'Home',
          path: '/',
        },
        {
          tile: 'Blog',
          path: '/blog',
        },
      ],
    },
  });

  // @todo nicely nest array of objects on multiple lines
  const expected = `
{% include "@components/button.twig" with {
   title: "A Button",
   isDark: true,
   buttons: [{"title":"Home","path":"/"},{"tile":"Blog","path":"/blog"}],
} only %}
    `;
  t.is(actual.trim(), expected.trim());
});

test('renderer-twig twig usage template e', async t => {
  const before = `{# Here's some "before" text #}`;
  const after = `{# Here's some "after" text #}`;
  const actual = await getTwigUsage({
    templateName: '@components/button.twig',
    before,
    after,
    props: {
      title: 'A Button',
      isDark: true,
      buttons: [
        {
          title: 'Home',
          path: '/',
        },
        {
          tile: 'Blog',
          path: '/blog',
        },
      ],
    },
  });

  const expected = `
{# Here's some "before" text #}

{% include "@components/button.twig" with {
   title: "A Button",
   isDark: true,
   buttons: [{"title":"Home","path":"/"},{"tile":"Blog","path":"/blog"}],
} only %}

{# Here's some "after" text #}
    `;
  t.is(actual.trim(), expected.trim());
});
