---
id: add-new-pattern
title: Add a New Pattern
---

## Add a New Pattern 

Knapsack will start tracking and documenting your Patterns by simply adding the following four files to any directory that contains a Pattern. 

1) `knapsack.pattern.js` - defines a unique id for the given pattern, as well as an array of templates that create the pattern and their associated schema files.
2) `knapsack.pattern-meta.json` - defines meta data about the pattern including its human friendly name, type, and description.
3) `your-component.schema.js` - A json schema for the component.
4) Template file(s). e.g. `your-component.twig`, `your-component.html`, `your-component.js`.
4) *_Optional & Encouraged_* `README.md` - Optional documentation for the component.
