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
