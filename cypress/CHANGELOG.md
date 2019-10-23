# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.6.1](https://github.com/basaltinc/knapsack/compare/v1.6.0...v1.6.1) (2019-10-23)

**Note:** Version bump only for package @knapsack/cypress





## [1.5.4](https://github.com/basaltinc/knapsack/compare/v1.5.3...v1.5.4) (2019-10-16)

**Note:** Version bump only for package @knapsack/cypress





## [1.4.1](https://github.com/basaltinc/knapsack/compare/v1.3.1...v1.4.1) (2019-10-09)

**Note:** Version bump only for package @knapsack/cypress





# [1.0.0](https://github.com/basaltinc/bedrock/compare/v0.45.3...v1.0.0) (2019-04-16)


### Features

* rename Bedrock to Knapsack ([#231](https://github.com/basaltinc/bedrock/issues/231)) ([0b4fc29](https://github.com/basaltinc/bedrock/commit/0b4fc29))


### BREAKING CHANGES

* This implements the projects name change from "Bedrock" to "Knapsack" across the code base; basically everywhere there was `bedrock` there is now `knapsack`. 


## The big changes to pay attention to are:

### All config files have been renamed

- `bedrock.config.js` => `knapsack.config.js`
- `bedrock.pattern.js` => `knapsack.pattern.js`
- Including all of the data `bedrock.*.json` files as well

### All package names have changed

The **main** package `@basalt/bedrock` is now `@basalt/knapsack` - this is now the only package under `@basalt`, every other one is under `@knapsack`.

- `@basalt/bedrock-renderer-html` => `@knapsack/renderer-html`
- `@basalt/bedrock-color-swatch` => `@knapsack/color-swatch`
- and so on and so forth...

<details>
<summary>All new package names</summary>

```
@knapsack/api-demo
@knapsack/atoms
@knapsack/breakpoints-demo
@knapsack/code-block
@knapsack/color-contrast-block
@knapsack/color-swatch
@knapsack/copy-to-clipboard
@knapsack/design-token-demos
@knapsack/pretty-code
@knapsack/schema-form
@knapsack/schema-table
@knapsack/smart-grid
@knapsack/spacing-swatch
@knapsack/spinner
@knapsack/tabbed-panel
@basalt/knapsack
@knapsack/babel-config
@knapsack/core
create-knapsack
@knapsack/eslint-config
@knapsack/plugin-custom-homepage
@knapsack/renderer-html
@knapsack/renderer-react
@knapsack/renderer-twig
@knapsack/schema-utils
@knapsack/utils
```

</details>

## Other than that, it all should *just work*.

This doesn't make *any* changes to the function that we've built up in Bedrock up to this point, however we wouldn't want to go breaking our API this much without a major version bump; and to be honest: Bedrock is ready. 

I've always loved the name Bedrock; it's something you feel comfortable building something big on. However, I love the next step we're taking by renaming Bedrock to Knapsack; it's something that helps you prepare to go far. 

#### The [Knapsack Problem](https://en.wikipedia.org/wiki/Knapsack_problem)

> Given a set of items, each with a weight and a value, determine the number of each item to include in a collection so that the total weight is less than or equal to a given limit and the total value is as large as possible. It derives its name from the problem faced by someone who is constrained by a fixed-size knapsack and must fill it with the most valuable items. The knapsack problem has been studied for more than a century, with early works dating as far back as 1897.

I look forward to using Knapsack to solve the Knapsack problem!

# Here's to v1.0.0! :tada: 





# [0.45.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.45.0) (2019-04-08)

**Note:** Version bump only for package @knapsack/cypress





# [0.44.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.44.0) (2019-04-08)

**Note:** Version bump only for package @knapsack/cypress





# [0.43.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.43.0) (2019-04-08)

**Note:** Version bump only for package @knapsack/cypress





# [0.42.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.42.0) (2019-04-08)

**Note:** Version bump only for package @knapsack/cypress





# [0.41.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.41.0) (2019-04-08)

**Note:** Version bump only for package @knapsack/cypress





# [0.40.0](https://github.com/basaltinc/knapsack/compare/v0.39.2...v0.40.0) (2019-03-28)

**Note:** Version bump only for package @knapsack/cypress





## [0.39.1](https://github.com/basaltinc/knapsack/compare/v0.39.0...v0.39.1) (2019-03-07)

**Note:** Version bump only for package @knapsack/cypress
