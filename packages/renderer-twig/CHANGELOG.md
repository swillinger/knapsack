# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-beta.11](https://github.com/basaltinc/knapsack/compare/v2.0.0-beta.10...v2.0.0-beta.11) (2019-12-30)


### Features

* a ton of awesomeness ([cb0ace5](https://github.com/basaltinc/knapsack/commit/cb0ace5c021e71b903abe277fbe60924ed3f8140))





# [2.0.0-beta.9](https://github.com/basaltinc/knapsack/compare/v2.0.0-beta.8...v2.0.0-beta.9) (2019-12-24)


### Features

* global template language select ([bad4142](https://github.com/basaltinc/knapsack/commit/bad41426d8a88b1fb9278a6ad77d71211316839c))





# [2.0.0-beta.7](https://github.com/basaltinc/knapsack/compare/v2.0.0-beta.6...v2.0.0-beta.7) (2019-12-20)

**Note:** Version bump only for package @knapsack/renderer-twig





# [2.0.0-beta.6](https://github.com/basaltinc/knapsack/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2019-12-20)

**Note:** Version bump only for package @knapsack/renderer-twig





# [2.0.0-beta.5](https://github.com/basaltinc/knapsack/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2019-12-20)

**Note:** Version bump only for package @knapsack/renderer-twig





# [1.6.0](https://github.com/basaltinc/knapsack/compare/v1.5.4...v1.6.0) (2019-10-22)


### Features

* convert to TypeScript, providing better auto-complete to users ([#265](https://github.com/basaltinc/knapsack/issues/265)) ([06f45fb](https://github.com/basaltinc/knapsack/commit/06f45fb7fa06078c495833942dc3d2028d7b34c1))





## [1.1.14](https://github.com/basaltinc/knapsack/compare/v1.1.13...v1.1.14) (2019-05-01)


### Bug Fixes

* update peerDeps correctly on renderers ([2dd8122](https://github.com/basaltinc/knapsack/commit/2dd8122))





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

The **main** package `@basalt/bedrock` is now `@knapsack/app` - this is now the only package under `@basalt`, every other one is under `@knapsack`.

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
@knapsack/app
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

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.44.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.44.0) (2019-04-08)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.43.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.43.0) (2019-04-08)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.42.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.42.0) (2019-04-08)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.41.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.41.0) (2019-04-08)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.40.0](https://github.com/basaltinc/knapsack/compare/v0.39.2...v0.40.0) (2019-03-28)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.39.0](https://github.com/basaltinc/knapsack/compare/v0.38.3...v0.39.0) (2019-03-07)

**Note:** Version bump only for package @knapsack/renderer-twig





## [0.38.2](https://github.com/basaltinc/knapsack/compare/v0.38.1...v0.38.2) (2019-03-06)

**Note:** Version bump only for package @knapsack/renderer-twig





## [0.38.1](https://github.com/basaltinc/knapsack/compare/v0.38.0...v0.38.1) (2019-03-06)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.38.0](https://github.com/basaltinc/knapsack/compare/v0.37.2...v0.38.0) (2019-03-06)


### Features

* add template usage code block ([a8fe90e](https://github.com/basaltinc/knapsack/commit/a8fe90e))





# [0.37.0](https://github.com/basaltinc/knapsack/compare/v0.36.0...v0.37.0) (2019-02-24)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.36.0](https://github.com/basaltinc/knapsack/compare/v0.35.0...v0.36.0) (2019-02-23)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.35.0](https://github.com/basaltinc/knapsack/compare/v0.34.2...v0.35.0) (2019-02-23)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.34.0](https://github.com/basaltinc/knapsack/compare/v0.33.3...v0.34.0) (2019-02-17)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.33.0](https://github.com/basaltinc/knapsack/compare/v0.32.5...v0.33.0) (2019-02-15)

**Note:** Version bump only for package @knapsack/renderer-twig





## [0.32.1](https://github.com/basaltinc/knapsack/compare/v0.32.0...v0.32.1) (2019-02-13)


### Bug Fixes

* update renderer peerDeps ([bcd9458](https://github.com/basaltinc/knapsack/commit/bcd9458))





# [0.32.0](https://github.com/basaltinc/knapsack/compare/v0.31.1...v0.32.0) (2019-02-13)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.31.0](https://github.com/basaltinc/knapsack/compare/v0.30.0...v0.31.0) (2019-02-12)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.29.0](https://github.com/basaltinc/knapsack/compare/v0.28.5...v0.29.0) (2019-01-23)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.28.0](https://github.com/basaltinc/knapsack/compare/v0.27.2...v0.28.0) (2019-01-22)

**Note:** Version bump only for package @knapsack/renderer-twig





## [0.27.2](https://github.com/basaltinc/knapsack/compare/v0.27.1...v0.27.2) (2019-01-15)


### Bug Fixes

* update twig-renderer ([47eeeb9](https://github.com/basaltinc/knapsack/commit/47eeeb9))





# [0.27.0](https://github.com/basaltinc/knapsack/compare/v0.26.1...v0.27.0) (2019-01-07)

**Note:** Version bump only for package @knapsack/renderer-twig





## [0.26.1](https://github.com/basaltinc/knapsack/compare/v0.26.0...v0.26.1) (2019-01-04)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.26.0](https://github.com/basaltinc/knapsack/compare/v0.25.1...v0.26.0) (2019-01-04)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.25.0](https://github.com/basaltinc/knapsack/compare/v0.24.1...v0.25.0) (2019-01-03)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.24.0](https://github.com/basaltinc/knapsack/compare/v0.23.0...v0.24.0) (2018-12-27)


### Features

* create KnapsackRendererWebpackBase ([5d6ded3](https://github.com/basaltinc/knapsack/commit/5d6ded3))





# [0.23.0](https://github.com/basaltinc/knapsack/compare/v0.22.0...v0.23.0) (2018-12-26)


### Performance Improvements

* **knapsack-renderer-twig:** improve prod speed ([6e85515](https://github.com/basaltinc/knapsack/commit/6e85515))





# [0.22.0](https://github.com/basaltinc/knapsack/compare/v0.21.0...v0.22.0) (2018-12-25)


### Features

* templateRenderers now get more info in render ([91407ff](https://github.com/basaltinc/knapsack/commit/91407ff))
* templateRenderers now have build and watch methods ([9a0a0a3](https://github.com/basaltinc/knapsack/commit/9a0a0a3))





# [0.21.0](https://github.com/basaltinc/knapsack/compare/v0.20.5...v0.21.0) (2018-12-22)

**Note:** Version bump only for package @knapsack/renderer-twig





# [0.20.0](https://github.com/basaltinc/knapsack/compare/v0.19.0...v0.20.0) (2018-12-13)


### Features

* multiple template renderer support ([1563ec0](https://github.com/basaltinc/knapsack/commit/1563ec0)), closes [#162](https://github.com/basaltinc/knapsack/issues/162)
