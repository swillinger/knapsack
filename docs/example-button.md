---
id: example-button
title: Example: Button
---

## Example: Setting up a button

- A "Button" Pattern

`button/knapsack.pattern.js`
```javascript
const schema = require('./button.schema');

module.exports = {
  id: 'button',
  templates: [
    {
      name: '@components/button.twig',
      schema,
    },
  ],
};
```

`button/knapsack.pattern-meta.json`
```json
{
  "title": "Button",
  "type": "component",
  "description": "A Button allows user to interact with the site.",
  "uses": ["inSlice, inComponent"],
  "demoSize": "m"
}
```

`button/button.schema.js`
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
    },
    url: {
      type: 'string',
      title: 'Url',
    },
  },
  examples: [
    {
      text: 'Click Here',
      url: 'https://basalt.io',
    },
  ],
};
```

`button/button.twig`
```twig
<a class="button" href={{ url }}>{{ text }}</a>
```

## Example: Combining Schema to Define Nested Components

- A "Card" component which uses the above defined "Button"

`card/knapsack.pattern.js`
```javascript
const schema = require('./card.schema');

module.exports = {
  id: 'card',
  templates: [
    {
      name: '@components/card.twig',
      schema,
    },
  ],
};
```


`card/knapsack.pattern-meta.json`
```json
{
  "title": "Card",
  "type": "component",
  "description": "A Card that powers the internet",
  "uses": ["inSlice"],
  "demoSize": "m"
}
```

`card/card.schema.js`
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
    buttons: {
      title: 'Buttons',
      type: 'array',
      items: buttonSchema,
    },
  },
  examples: [
    {
      title: "I'm a Card Title",
      body:
        "I'm a body - Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      buttons: [
        {
          text: 'Button one',
          url: '/url-one'
        },
        {
          text: 'Button two',
          url: '/url-two'
        }
      ]
    },
  ],
};
```
