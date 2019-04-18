---
id: example-nesting-patterns
title: Example: Nesting Patterns
---

## Example: Combining Schema to Define Nested Components

We're big fans of [atomic design](http://atomicdesign.bradfrost.com/). If you are too, you'll likely be including smaller patterns (atoms) in large patterns (molecules or organisms). Rather than repeat your work and fragment your codebase, you can easily include schema and templates to truly maintain a single source of truth.

Here's an example of setting up a card pattern, which includes the button you've already made.



File: `card/knapsack.pattern.js`
```javascript
const schema = require('./card.schema');

module.exports = {
  id: 'card',
  templates: [
    {
      alias: '@components/card.twig',
      path: './card.twig',
      id: 'card',
      title: 'Card',
      docPath: './README.md',
      schema,
    },
  ],
};
```


File: `card/knapsack.pattern-meta.json`
```json
{
  "title": "Card",
  "type": "molecule",
  "description": "A Card that powers the internet",
  "uses": ["inSlice"],
  "demoSize": "m"
}
```

File: `card/card.schema.js`
```javascript
const buttonSchema = require('../button/button.schema');

module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Card',
  description: 'A Card that powers the internet',
  required: ['title', 'body'],
  properties: {
    title: {
      type: 'string',
      title: 'Title',
    },
    body: {
      type: 'string',
      title: 'Body',
    },
    button: buttonSchema,
  },
  examples: [
    {
      title: "I'm a Card Title",
      body:
        "I'm a body - Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      button: {
        text: 'Click Me',
        url: '/url'
      },
    },
  ],
};
```
