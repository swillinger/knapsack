---
id: patterns-anatomy
title: Anatomy of a Pattern
---

## Files needed to register a pattern with knapsack

The following files are required to register a given component with Knapsack. Including the followings files within a directory listed in the `patterns` in `knapsack.config.js` will automatically include the pattern in the Knapsack interface.

1) `knapsack.pattern.js` - defines a unique id for the given pattern, as well as an array of templates that create the pattern and their associated schema files.
2) `knapsack.pattern-meta.json` - defines meta data about the pattern including its human friendly name, type, and description.
3) `your-component.schema.js` - A json schema for the component.
4) *_Optional_* `README.md` - Optional documentation for the component.

This section of the docs will dive deeper into the contents of these files.

## `knapsack.pattern.js`

### Basic configuration

Here is a basic configuration of the `knapsack.pattern.js` file. Note that you can register multiple templates per pattern, a feature that can be used in a variate of ways (for example, creating pre-defined versions of a component or supporting multiple templating languages).

```
const yourComponentSchema = require('./your-component.schema');

module.exports = {
  id: 'your-component',
  templates: [
    {
      id: 'your-component-twig',
      title: 'your-component - Twig',
      alias: '@components/your-component.twig',
      path: './your-component.twig',
      docPath: './README.md',
      schema: yourComponentSchema,
    },
  ],
};
```

### Advance configuration

In addition to the above fields, it is possible to register multiple asset sets per components. See (Asset Sets/coming soon)[coming soon] for more information on registering and using multiple asset sets.

## `knapsack.pattern-meta.json`

Here is an example `knapsack.pattern-meta.json` would look like. Note that these fields can be edited either in the code, or through the Knapsack GUI.

```
{
  "title": "Card",
  "description": "A Card that powers the internet",
  "type": "components",
  "status": "ready",
  "uses": [
    "inSlice"
  ],
  "hasIcon": true,
  "showAllTemplates": true,
  "demoSize": "m"
}
```

|Property|Description|
|--------|-----------|
|title|This is the human friendly name for the pattern.|
|description|This is a description of the pattern.|
|type|Users are able to define their own types to help categorize patterns. See (Link coming soon to Types docs)[coming soon]. For example, this field might be 'components' or 'layouts'.|
|status|Users are able to define their own component statuses. See (Link coming soon to Status docs)[coming soon]. For example, this field might be 'draft', 'ready', or 'deprecated'.|
|uses| The 'uses' field is intended to capture where patterns are intended to be used. See (Link coming soon to Uses docs)[coming soon]. For example, this field might be 'inSlice' or 'inGrid'.|
|hasIcon| Is there an icon associated with this pattern? `true` or `false`|
|showAllTemplates| Should the default setting for the GUI be to show all template variations, or just the first variation. `true` or `false`|
|demoSize| How much space should the component demo use by default. "s", "m", "l", or "full"|

> Why is this file a json? Json is easily serializable and allows for read/write capability through the GUI.


## `your-component.schema.js`

This is a file that exports a json object that complies with JsonSchema Standards.
See [Json Schema Org](https://json-schema.org/) and [Json Schema Tutorial](https://www.tutorialspoint.com/json/json_schema.htm).

> This file can be either a .js or .json. As long as it can be imported into `knapsack.pattern.js` and complies with Json Schema standards, you should be good to go.

## Example Pattern Anatomy - Button

Example Directory Structure

```
button/
├── button.twig
├── button.scss
├── button.js
├── button.schema.js
├── knapsack.pattern.js
├── knapsack.pattern-meta.json
└── readme.md
```
