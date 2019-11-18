# Knapsack (formerly Bedrock)

If you want to use Knapsack, head to <https://knapsack.basalt.io>, if you are working on Knapsack please keep reading.

# Commands

## Set up

- `yarn install` - Install all dependencies
- `yarn start` - Build everything needed to get started; then watch and rebuild

## See the "examples"

You can work in any of the folders found in `./examples` by running `yarn start` from within those directories (in a new terminal tab).

## Storybook

```
cd design-system
yarn start:storybook
```

# TypeScript

## TypeScript & React

- [Cheatsheets for experienced React developers getting started with TypeScript](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet)

### Common Patterns & Types

#### Basic Component

```tsx
import React from 'react';
import classnames from 'classnames'; // https://www.npmjs.com/package/classnames
import './my-component.scss';

type Props = {
  /**
   * The main title of it
   */
  title: string;
  /**
   * Extra info that goes directly under title
   */
  subtitle?: string;
  /**
   * Is this the main focus or not?
   */
  type: 'primary' | 'secondary';
  /**
   * Give it a dark color scheme?
   */
  isDark?: boolean;
  /**
   * Children components that go under the header
   */
  children: React.ReactNode;
};

export const MyComponent: React.FC<Props> = ({
  title,
  subtitle,
  type = 'primary',
  isDark = false,
  children,
}: Props) => {
  const classes = classnames({
    'k-my-component': true,
    'k-my-component--is-dark': isDark,
    [`k-my-component--${type}`]: true, // will be either `k-my-component--primary` or `k-my-component--secondary`
  });

  return (
    <div className={classes}>
      <header>
        <h2>{title}</h2>
        {subtitle && <h3>{subtitle}</h3>}
      </header>
      <div>{children}</div>
    </div>
  );
};
```

# Using Git & GitHub

## Commiting

We use Conventional Commits to automatically release versions. Please use `yarn commit` to ensure your commit message is of the correct format.

# Setting up JSON Knapsack config file auto-complete 

Our TypeScript types compile out to JSON Schemas (that are git-ignored, so make sure to build first) that are located here: `./knapsack/src/json-schemas/`. When editing Knapsack config files (often in a `./data` directory) your code editor can be set up to use these to enable rich auto-complete. Here's the config file to JSON schema map:

- `knapsack.settings.json` = `./knapsack/src/json-schemas/schemaKnapsackSettings.json`
- `knapsack.pattern.*.json` = `./knapsack/src/json-schemas/schemaKnapsackPattern.json`
- `knapsack.navs.json` = `./knapsack/src/json-schemas/schemaKnapsackNavsConfig.json`

You can set these custom JSON Schemas up in your specific code editor:

- [PhpStorm setup](https://www.jetbrains.com/help/phpstorm/2019.3/json.html#ws_json_schema_add_custom)
- [VS Code setup](https://code.visualstudio.com/docs/languages/json#_mapping-to-a-schema-in-the-workspace)

For more info on how the Typescript types to JSON Schema compile happens and to add more, see `./knapsack/convert-types-to-json-schemas.js`.
