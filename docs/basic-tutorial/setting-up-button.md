---
title: Setting up a Button Pattern
---

# **Warning: Doc out of date; below is for v1 (preserved for v2 inspiration)**

## Example: Setting up a button

Let's start with a small pattern example – a button! Here are the basic files and file contents needed to build a button in Knapsack.

_Note: This example does not include styles. Styles can be handled a number of ways, including through a button.scss file in this same directory — this will depend on your build setup._

File: `button/knapsack.pattern.js`

```javascript
const schema = require('./button.schema');

module.exports = {
  id: 'button',
  templates: [
    {
      alias: '@components/button.twig',
      path: './button.twig',
      id: 'button',
      title: 'Button',
      docPath: './README.md',
      schema,
    },
  ],
};
```

File: `button/knapsack.pattern-meta.json`

```json
{
  "title": "Button",
  "type": "atom",
  "description": "A Button allows user to interact with the site.",
  "uses": ["inComponent"],
  "demoSize": "s"
}
```

File: `button/button.schema.js`

```javascript
module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Button',
  description: 'A Button for clicking!',
  required: ['text', 'url'],
  properties: {
    text: {
      type: 'string',
      title: 'Text',
      description: 'This text will show as the button text',
    },
    url: {
      type: 'string',
      title: 'Url',
      description: 'This URL will be the destination upon clicking the button',
    },
  },
  examples: [
    {
      text: 'Click Here',
      url: 'https://basalt.io',
    },
    {
      text: 'Learn More',
      url: 'https://basalt.io/who-we-are',
    },
  ],
};
```

File: `button/button.twig`

```twig
<a class="button" href={{ url }}>{{ text }}</a>
```
