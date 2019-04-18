---
id: patterns-overview
title: Patterns Overview
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

See [Simple Example](https://github.com/basaltinc/knapsack/tree/develop/examples/simple) for further examples on setting up, configuring, and including patterns in Knapsack.
