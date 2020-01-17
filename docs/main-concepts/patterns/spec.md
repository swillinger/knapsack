---
id: spec
title: Spec
---

## Using spec meta data

Knapsack will write out useful metadata into the directory defined in `config.dist` about your patterns. All patterns will get a JSON Schema generated but specific template renderers will add more.

### React Typescript Definitions

```jsx
import { ButtonProps } from '../dist/meta/react';
```

![](/assets/spec-autocomplete--react.png)

### Web Components

Knapsack places a `knapsack.html-data.json` inside the "meta" subdirectory of the `config.dist` directory that conforms to the [VS Code Custom Data format](https://github.com/microsoft/vscode-custom-data) that will allow the auto-complete experience below:

![](/assets/spec-autocomplete--web-component.png)

To set up, add the below code to your `./vscode/settings.json` file:

```json
{
  "html.customData": ["./dist/meta/knapsack.html-data.json"]
}
```
