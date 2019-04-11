---
id: patterns-overview
title: Patterns
---

Patterns are the visual components that make up a design system. 

Unlike other pattern library tools which rely on the creation and continued maintenance of demonstration files, Knapsack relies on data models defined through [Json Schema](https://json-schema.org/) to power the automatic creation of all the variations of any given Pattern.

## Setting Up Patterns for Knapsack

Knapsack will start tracking and documenting your Patterns by simply adding the following three files to any directory that contains a Pattern. 

1) `knapsack.pattern.js` - defines a unique id for the given pattern, as well as an array of templates that create the pattern and their associated schema files.
2) `knapsack.pattern-meta.json` - defines meta data about the pattern including its human friendly name, type, and description.
3) `your-component.schema.js` - A json schema for the component.
4) *_Optional_* `README.md` - Optional documentation for the component.

## Including Patterns in Knapsack

In your `knapsack.config.js` file, include all directories that contain patterns. Knapsack supports globbing, which means you can include a parent directory and all patterns within that pattern directory that include a `knapsack.pattern.js`, `knapsack.pattern-meta.json`, and `schema.js` file will be included.

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

See [Simple Example](https://github.com/basaltinc/knapsack/tree/develop/examples/simple) for further examples on setting up, configuring, and including patterns in Knapsack.
