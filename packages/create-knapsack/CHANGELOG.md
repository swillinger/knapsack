# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-beta.23](https://github.com/basaltinc/knapsack/compare/v2.0.0-beta.22...v2.0.0-beta.23) (2020-01-02)

**Note:** Version bump only for package create-knapsack





## [1.5.2](https://github.com/basaltinc/knapsack/compare/v1.5.1...v1.5.2) (2019-10-15)


### Bug Fixes

* compile server to node v10 ([#263](https://github.com/basaltinc/knapsack/issues/263)) ([b3be4e6](https://github.com/basaltinc/knapsack/commit/b3be4e6d32b330cc7ac47eefbc7a5e3d57bdc92b))





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

**Note:** Version bump only for package create-knapsack





# [0.44.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.44.0) (2019-04-08)

**Note:** Version bump only for package create-knapsack





# [0.43.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.43.0) (2019-04-08)

**Note:** Version bump only for package create-knapsack





# [0.42.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.42.0) (2019-04-08)

**Note:** Version bump only for package create-knapsack





# [0.41.0](https://github.com/basaltinc/knapsack/compare/v0.40.6...v0.41.0) (2019-04-08)

**Note:** Version bump only for package create-knapsack





# [0.40.0](https://github.com/basaltinc/knapsack/compare/v0.39.2...v0.40.0) (2019-03-28)

**Note:** Version bump only for package create-knapsack





# [0.39.0](https://github.com/basaltinc/knapsack/compare/v0.38.3...v0.39.0) (2019-03-07)

**Note:** Version bump only for package create-knapsack





## [0.38.2](https://github.com/basaltinc/knapsack/compare/v0.38.1...v0.38.2) (2019-03-06)

**Note:** Version bump only for package create-knapsack





## [0.38.1](https://github.com/basaltinc/knapsack/compare/v0.38.0...v0.38.1) (2019-03-06)

**Note:** Version bump only for package create-knapsack





# [0.38.0](https://github.com/basaltinc/knapsack/compare/v0.37.2...v0.38.0) (2019-03-06)

**Note:** Version bump only for package create-knapsack





# [0.37.0](https://github.com/basaltinc/knapsack/compare/v0.36.0...v0.37.0) (2019-02-24)

**Note:** Version bump only for package create-knapsack





# [0.36.0](https://github.com/basaltinc/knapsack/compare/v0.35.0...v0.36.0) (2019-02-23)

**Note:** Version bump only for package create-knapsack





# [0.35.0](https://github.com/basaltinc/knapsack/compare/v0.34.2...v0.35.0) (2019-02-23)

**Note:** Version bump only for package create-knapsack





# [0.34.0](https://github.com/basaltinc/knapsack/compare/v0.33.3...v0.34.0) (2019-02-17)

**Note:** Version bump only for package create-knapsack





# [0.33.0](https://github.com/basaltinc/knapsack/compare/v0.32.5...v0.33.0) (2019-02-15)

**Note:** Version bump only for package create-knapsack





# [0.32.0](https://github.com/basaltinc/knapsack/compare/v0.31.1...v0.32.0) (2019-02-13)

**Note:** Version bump only for package create-knapsack





# [0.31.0](https://github.com/basaltinc/knapsack/compare/v0.30.0...v0.31.0) (2019-02-12)


### Bug Fixes

* release nudge ([5f47060](https://github.com/basaltinc/knapsack/commit/5f47060))





# [0.30.0](https://github.com/basaltinc/knapsack/compare/v0.30.0-alpha.4...v0.30.0) (2019-02-08)

**Note:** Version bump only for package create-knapsack





# [0.29.0](https://github.com/basaltinc/knapsack/compare/v0.28.5...v0.29.0) (2019-01-23)

**Note:** Version bump only for package create-knapsack





# [0.28.0](https://github.com/basaltinc/knapsack/compare/v0.27.2...v0.28.0) (2019-01-22)


### Features

* markdown per template ([#179](https://github.com/basaltinc/knapsack/issues/179)) ([cd338ba](https://github.com/basaltinc/knapsack/commit/cd338ba)), closes [#180](https://github.com/basaltinc/knapsack/issues/180)





# [0.27.0](https://github.com/basaltinc/knapsack/compare/v0.26.1...v0.27.0) (2019-01-07)


### Features

* add cli command for testing all renders ([95b5cea](https://github.com/basaltinc/knapsack/commit/95b5cea))





## [0.26.1](https://github.com/basaltinc/knapsack/compare/v0.26.0...v0.26.1) (2019-01-04)

**Note:** Version bump only for package create-knapsack





# [0.26.0](https://github.com/basaltinc/knapsack/compare/v0.25.1...v0.26.0) (2019-01-04)

**Note:** Version bump only for package create-knapsack





# [0.25.0](https://github.com/basaltinc/knapsack/compare/v0.24.1...v0.25.0) (2019-01-03)

**Note:** Version bump only for package create-knapsack





# [0.24.0](https://github.com/basaltinc/knapsack/compare/v0.23.0...v0.24.0) (2018-12-27)

**Note:** Version bump only for package create-knapsack





# [0.23.0](https://github.com/basaltinc/knapsack/compare/v0.22.0...v0.23.0) (2018-12-26)

**Note:** Version bump only for package create-knapsack





# [0.22.0](https://github.com/basaltinc/knapsack/compare/v0.21.0...v0.22.0) (2018-12-25)

**Note:** Version bump only for package create-knapsack





# [0.21.0](https://github.com/basaltinc/knapsack/compare/v0.20.5...v0.21.0) (2018-12-22)


### Features

* **knapsack:** knapsack.config.js change: templates => templateRenderers ([4036e75](https://github.com/basaltinc/knapsack/commit/4036e75)), closes [#165](https://github.com/basaltinc/knapsack/issues/165)





# [0.20.0](https://github.com/basaltinc/knapsack/compare/v0.19.0...v0.20.0) (2018-12-13)


### Features

* multiple template renderer support ([1563ec0](https://github.com/basaltinc/knapsack/commit/1563ec0)), closes [#162](https://github.com/basaltinc/knapsack/issues/162)





# [0.19.0](https://github.com/basaltinc/knapsack/compare/v0.18.2...v0.19.0) (2018-12-12)


### Features

* **knapsack:** setup super basic permissions for read/write ([70a51cd](https://github.com/basaltinc/knapsack/commit/70a51cd))





## [0.18.1](https://github.com/basaltinc/knapsack/compare/v0.18.0...v0.18.1) (2018-12-11)


### Bug Fixes

* license GPL-2.0-only -> GPL-2.0-or-later ([99f021f](https://github.com/basaltinc/knapsack/commit/99f021f))





# [0.18.0](https://github.com/basaltinc/knapsack/compare/v0.17.6...v0.18.0) (2018-12-11)


### Features

* Add GPL v2 License ([d9806a1](https://github.com/basaltinc/knapsack/commit/d9806a1))





## [0.17.2](https://github.com/basaltinc/knapsack/compare/v0.17.1...v0.17.2) (2018-12-08)


### Bug Fixes

* **knapsack:** improve css and js config paths ([#146](https://github.com/basaltinc/knapsack/issues/146)) ([9539a54](https://github.com/basaltinc/knapsack/commit/9539a54)), closes [#145](https://github.com/basaltinc/knapsack/issues/145)





# [0.17.0](https://github.com/basaltinc/knapsack/compare/v0.16.6...v0.17.0) (2018-12-08)

**Note:** Version bump only for package create-knapsack





## [0.16.5](https://github.com/basaltinc/knapsack/compare/v0.16.4...v0.16.5) (2018-12-06)


### Bug Fixes

* **knapsack:** make public directory straightforward ([52dfc6e](https://github.com/basaltinc/knapsack/commit/52dfc6e))





## [0.16.4](https://github.com/basaltinc/knapsack/compare/v0.16.3...v0.16.4) (2018-12-06)

**Note:** Version bump only for package create-knapsack





## [0.16.3](https://github.com/basaltinc/knapsack/compare/v0.16.2-alpha.3...v0.16.3) (2018-12-06)



## [0.16.2](https://github.com/basaltinc/knapsack/compare/v0.16.1...v0.16.2) (2018-12-06)

**Note:** Version bump only for package create-knapsack





## [0.16.2](https://github.com/basaltinc/knapsack/compare/v0.16.1...v0.16.2) (2018-12-06)

**Note:** Version bump only for package create-knapsack





## [0.16.1](https://github.com/basaltinc/knapsack/compare/v0.16.1-alpha.6...v0.16.1) (2018-12-06)

**Note:** Version bump only for package create-knapsack





# [0.16.0](https://github.com/basaltinc/knapsack/compare/v0.15.1-alpha.2...v0.16.0) (2018-12-05)


### Bug Fixes

* **knapsack:** fix file-loader hoisting, config for assets ([#115](https://github.com/basaltinc/knapsack/issues/115)) ([a1fbf6f](https://github.com/basaltinc/knapsack/commit/a1fbf6f)), closes [#98](https://github.com/basaltinc/knapsack/issues/98) [#110](https://github.com/basaltinc/knapsack/issues/110)


### Features

* **knapsack:** patterns readme markdown files render on overview page ([d2563f0](https://github.com/basaltinc/knapsack/commit/d2563f0)), closes [#118](https://github.com/basaltinc/knapsack/issues/118)





## [0.15.1-alpha.0](https://github.com/basaltinc/knapsack/compare/v0.15.0...v0.15.1-alpha.0) (2018-12-05)

**Note:** Version bump only for package create-knapsack





# [0.15.0](https://github.com/basaltinc/knapsack/compare/v0.13.1...v0.15.0) (2018-12-03)

**Note:** Version bump only for package create-knapsack





# [0.14.0](https://github.com/basaltinc/knapsack/compare/v0.13.1...v0.14.0) (2018-12-03)

**Note:** Version bump only for package create-knapsack





## [0.13.1](https://github.com/basaltinc/knapsack/compare/v0.13.0...v0.13.1) (2018-11-29)


### Bug Fixes

* fix settings design tokens bug ([725d2cc](https://github.com/basaltinc/knapsack/commit/725d2cc))





# [0.13.0](https://github.com/basaltinc/knapsack/compare/v0.12.4...v0.13.0) (2018-11-29)

**Note:** Version bump only for package create-knapsack





## [0.12.4](https://github.com/basaltinc/knapsack/compare/v0.12.3...v0.12.4) (2018-11-29)


### Bug Fixes

* **knapsack:** parent brand link opens in new tab ([2e4fdf0](https://github.com/basaltinc/knapsack/commit/2e4fdf0))





## [0.12.2](https://github.com/basaltinc/knapsack/compare/v0.12.1...v0.12.2) (2018-11-28)


### Bug Fixes

* **knapsack:** parent brand link opens in new tab ([2e4fdf0](https://github.com/basaltinc/knapsack/commit/2e4fdf0))





## [0.12.1](https://github.com/basaltinc/knapsack/compare/v0.12.0...v0.12.1) (2018-11-28)


### Bug Fixes

* **knapsack:** update footer message ([884489f](https://github.com/basaltinc/knapsack/commit/884489f))
* **create-knapsack:** alter parentBrand url ([76cd4e7](https://github.com/basaltinc/knapsack/commit/76cd4e7))





# [0.12.0](https://github.com/basaltinc/knapsack/compare/v0.11.1...v0.12.0) (2018-11-28)

**Note:** Version bump only for package create-knapsack





## [0.11.1](https://github.com/basaltinc/knapsack/compare/v0.11.0...v0.11.1) (2018-11-28)

**Note:** Version bump only for package create-knapsack





# [0.11.0](https://github.com/basaltinc/knapsack/compare/v0.10.2...v0.11.0) (2018-11-28)


### Features

* **create-knapsack:** tighten up design tokens ([5fd78f3](https://github.com/basaltinc/knapsack/commit/5fd78f3))





## [0.10.2](https://github.com/basaltinc/knapsack/compare/v0.10.1...v0.10.2) (2018-11-28)


### Bug Fixes

* ensure now deploy uses latest create-knapsack pkg ([233c426](https://github.com/basaltinc/knapsack/commit/233c426))





## [0.10.1](https://github.com/basaltinc/knapsack/compare/v0.10.0...v0.10.1) (2018-11-28)

**Note:** Version bump only for package create-knapsack





# [0.10.0](https://github.com/basaltinc/knapsack/compare/v0.9.1...v0.10.0) (2018-11-28)


### Features

* **create-knapsack:** improved initial sample content ([97bff33](https://github.com/basaltinc/knapsack/commit/97bff33))





# [0.9.0](https://github.com/basaltinc/knapsack/compare/v0.8.0...v0.9.0) (2018-11-27)

**Note:** Version bump only for package create-knapsack





# [0.8.0](https://github.com/basaltinc/knapsack/compare/v0.7.7...v0.8.0) (2018-11-27)


### Features

* **create-knapsack:** change pattern filenames ([5682d14](https://github.com/basaltinc/knapsack/commit/5682d14))





## [0.7.8-alpha.0](https://github.com/basaltinc/knapsack/compare/v0.7.7...v0.7.8-alpha.0) (2018-11-27)


### Features

* **create-knapsack:** change pattern filenames ([5682d14](https://github.com/basaltinc/knapsack/commit/5682d14))
