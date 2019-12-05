import { getTwigUsage } from './utils';

describe('renderer-twig twig usage template', () => {
  test('a', async () => {
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
    expect(actual.trim()).toBe(expected.trim());
  });

  test('b', async () => {
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
    expect(actual.trim()).toBe(expected.trim());
  });

  test('c', async () => {
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
    expect(actual.trim()).toBe(expected.trim());
  });

  test('d', async () => {
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
    expect(actual.trim()).toBe(expected.trim());
  });

  test('e', async () => {
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
    expect(actual.trim()).toBe(expected.trim());
  });
});
