---
id: patterns-overview
title: Patterns Overview
---

Patterns are the visual components that make up a design system. 

Unlike other pattern library tools which rely on the creation and continued maintenance of demonstration files, Knapsack relies on data models defined through [Json Schema](https://json-schema.org/) to power the automatic creation of all the variations of any given Pattern.


## Including Patterns in Knapsack

In your `knapsack.config.js` file, include all directories that contain patterns. Knapsack supports globbing, which means you can include a parent directory and all patterns within that pattern directory that include a `knapsack.pattern.js`, `knapsack.pattern-meta.json`, and `schema.js` file will be included.

See [Simple Example](https://github.com/basaltinc/knapsack/tree/develop/examples/simple) for further examples on setting up, configuring, and including patterns in Knapsack.
