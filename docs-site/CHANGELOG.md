# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.1.13](https://github.com/basaltinc/knapsack/compare/v1.1.12...v1.1.13) (2019-04-26)

**Note:** Version bump only for package @knapsack/docs-site





## [1.1.12](https://github.com/basaltinc/knapsack/compare/v1.1.11...v1.1.12) (2019-04-25)

**Note:** Version bump only for package @knapsack/docs-site





## [1.1.11](https://github.com/basaltinc/knapsack/compare/v1.1.10...v1.1.11) (2019-04-24)

**Note:** Version bump only for package @knapsack/docs-site





## [1.1.10](https://github.com/basaltinc/knapsack/compare/v1.1.9...v1.1.10) (2019-04-24)

**Note:** Version bump only for package @knapsack/docs-site





## [1.1.9](https://github.com/basaltinc/knapsack/compare/v1.1.8...v1.1.9) (2019-04-23)

**Note:** Version bump only for package @knapsack/docs-site





## [1.1.8](https://github.com/basaltinc/knapsack/compare/v1.1.7...v1.1.8) (2019-04-23)


### Bug Fixes

* add patterns.getPatternDemoUrl() ([4aec5b2](https://github.com/basaltinc/knapsack/commit/4aec5b2))





## [1.1.7](https://github.com/basaltinc/knapsack/compare/v1.1.6...v1.1.7) (2019-04-20)


### Bug Fixes

* docs build ([3cd0902](https://github.com/basaltinc/knapsack/commit/3cd0902))





## [1.1.6](https://github.com/basaltinc/knapsack/compare/v1.1.5...v1.1.6) (2019-04-20)

**Note:** Version bump only for package @knapsack/docs-site





## [1.1.5](https://github.com/basaltinc/knapsack/compare/v1.1.4...v1.1.5) (2019-04-19)

**Note:** Version bump only for package @knapsack/docs-site





## [1.1.4](https://github.com/basaltinc/knapsack/compare/v1.1.3...v1.1.4) (2019-04-19)

**Note:** Version bump only for package @knapsack/docs-site





## [1.1.3](https://github.com/basaltinc/knapsack/compare/v1.1.2...v1.1.3) (2019-04-19)

**Note:** Version bump only for package @knapsack/docs-site





## [1.1.2](https://github.com/basaltinc/knapsack/compare/v1.1.1...v1.1.2) (2019-04-19)

**Note:** Version bump only for package @knapsack/docs-site





## [1.1.1](https://github.com/basaltinc/knapsack/compare/v1.1.0...v1.1.1) (2019-04-19)

**Note:** Version bump only for package @knapsack/docs-site





# [1.1.0](https://github.com/basaltinc/knapsack/compare/v1.0.9...v1.1.0) (2019-04-18)


### Features

* added beginning ui settings page ([d999cca](https://github.com/basaltinc/knapsack/commit/d999cca))





## [1.0.9](https://github.com/basaltinc/knapsack/compare/v1.0.8...v1.0.9) (2019-04-18)

**Note:** Version bump only for package @knapsack/docs-site





## [1.0.8](https://github.com/basaltinc/knapsack/compare/v1.0.7...v1.0.8) (2019-04-18)

**Note:** Version bump only for package @knapsack/docs-site





## [1.0.7](https://github.com/basaltinc/knapsack/compare/v1.0.6...v1.0.7) (2019-04-17)

**Note:** Version bump only for package @knapsack/docs-site





## [1.0.6](https://github.com/basaltinc/knapsack/compare/v1.0.5...v1.0.6) (2019-04-17)

**Note:** Version bump only for package @knapsack/docs-site





## [1.0.5](https://github.com/basaltinc/knapsack/compare/v1.0.4...v1.0.5) (2019-04-17)

**Note:** Version bump only for package @knapsack/docs-site





## [1.0.4](https://github.com/basaltinc/knapsack/compare/v1.0.3...v1.0.4) (2019-04-17)


### Bug Fixes

* redirect docs-site admin to CMS ([7cceb14](https://github.com/basaltinc/knapsack/commit/7cceb14))





## [1.0.3](https://github.com/basaltinc/knapsack/compare/v1.0.2...v1.0.3) (2019-04-17)


### Bug Fixes

* add knapsack.sh and bump docs version ([6ff2475](https://github.com/basaltinc/knapsack/commit/6ff2475))





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





## [0.45.2](https://github.com/basaltinc/knapsack/compare/v0.45.1...v0.45.2) (2019-04-11)


### Bug Fixes

* adjust docs deploy name ([6953be0](https://github.com/basaltinc/knapsack/commit/6953be0))





## [0.45.1](https://github.com/basaltinc/knapsack/compare/v0.45.0...v0.45.1) (2019-04-08)


### Bug Fixes

* docs-site bump ([6edd86e](https://github.com/basaltinc/knapsack/commit/6edd86e))





# [0.45.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.45.0) (2019-04-08)


### Bug Fixes

* correct docs-site repo base url ([c79dca9](https://github.com/basaltinc/knapsack/commit/c79dca9))
* docs-site postversion re-assigns git tag ([ed122ef](https://github.com/basaltinc/knapsack/commit/ed122ef))
* docs-site script version => postversion ([61f403a](https://github.com/basaltinc/knapsack/commit/61f403a))
* re-enable auto docs-site versioning ([ae820a9](https://github.com/basaltinc/knapsack/commit/ae820a9))
* revert docs-site postversion commit amend ([fed0588](https://github.com/basaltinc/knapsack/commit/fed0588))


### Features

* docs site ([289ffd7](https://github.com/basaltinc/knapsack/commit/289ffd7))





# [0.44.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.44.0) (2019-04-08)


### Bug Fixes

* correct docs-site repo base url ([c79dca9](https://github.com/basaltinc/knapsack/commit/c79dca9))
* docs-site postversion re-assigns git tag ([ed122ef](https://github.com/basaltinc/knapsack/commit/ed122ef))
* docs-site script version => postversion ([61f403a](https://github.com/basaltinc/knapsack/commit/61f403a))
* re-enable auto docs-site versioning ([ae820a9](https://github.com/basaltinc/knapsack/commit/ae820a9))


### Features

* docs site ([289ffd7](https://github.com/basaltinc/knapsack/commit/289ffd7))





# [0.43.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.43.0) (2019-04-08)


### Bug Fixes

* correct docs-site repo base url ([c79dca9](https://github.com/basaltinc/knapsack/commit/c79dca9))
* docs-site script version => postversion ([61f403a](https://github.com/basaltinc/knapsack/commit/61f403a))
* re-enable auto docs-site versioning ([ae820a9](https://github.com/basaltinc/knapsack/commit/ae820a9))


### Features

* docs site ([289ffd7](https://github.com/basaltinc/knapsack/commit/289ffd7))





# [0.42.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.42.0) (2019-04-08)


### Bug Fixes

* correct docs-site repo base url ([c79dca9](https://github.com/basaltinc/knapsack/commit/c79dca9))
* docs-site script version => postversion ([61f403a](https://github.com/basaltinc/knapsack/commit/61f403a))
* re-enable auto docs-site versioning ([ae820a9](https://github.com/basaltinc/knapsack/commit/ae820a9))


### Features

* docs site ([289ffd7](https://github.com/basaltinc/knapsack/commit/289ffd7))





# [0.41.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.41.0) (2019-04-08)


### Bug Fixes

* correct docs-site repo base url ([c79dca9](https://github.com/basaltinc/knapsack/commit/c79dca9))
* docs-site script version => postversion ([61f403a](https://github.com/basaltinc/knapsack/commit/61f403a))
* re-enable auto docs-site versioning ([ae820a9](https://github.com/basaltinc/knapsack/commit/ae820a9))


### Features

* docs site ([289ffd7](https://github.com/basaltinc/knapsack/commit/289ffd7))





## [0.40.6](https://github.com/basaltinc/knapsack/compare/v0.40.5...v0.40.6) (2019-04-08)


### Bug Fixes

* add docs-site/now.json ([76ac22f](https://github.com/basaltinc/knapsack/commit/76ac22f))
* amend docs site version commit ([e2631d1](https://github.com/basaltinc/knapsack/commit/e2631d1))
* disable auto docs-site versioning ([edbb293](https://github.com/basaltinc/knapsack/commit/edbb293))
* git add new versioned docs ([add25ac](https://github.com/basaltinc/knapsack/commit/add25ac))
* update config docs, add gifs ([040b1ee](https://github.com/basaltinc/knapsack/commit/040b1ee))





## [0.40.5](https://github.com/basaltinc/knapsack/compare/v0.40.4...v0.40.5) (2019-04-08)


### Bug Fixes

* docs deploy and index page ([0739c10](https://github.com/basaltinc/knapsack/commit/0739c10))





## [0.40.4](https://github.com/basaltinc/knapsack/compare/v0.40.3...v0.40.4) (2019-04-08)


### Bug Fixes

* create docs site ([#230](https://github.com/basaltinc/knapsack/issues/230)) ([5dc6c61](https://github.com/basaltinc/knapsack/commit/5dc6c61))
