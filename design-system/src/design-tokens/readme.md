# Knapsack Design System's Design Tokens

- Using [Style Dictionary](https://amzn.github.io/style-dictionary) format, look here for docs
- Compiles out to `../../dist/ks-design-tokens.css` so look there for how the output looks
- That in turn is pulled into the final `../../dist/ks-design-system.css`

![](https://amzn.github.io/style-dictionary/assets/cti.png)

## Using tokens in tokens

See how the "inverse" color is using the default bg color by accessing it like you would in JS: `c.bg.default.value`. **Don't forget the `.value` at the end!**. [More info here](https://amzn.github.io/style-dictionary/#/properties?id=attribute-reference-alias)

```json
{
  "c": {
    "bg": {
      "default": {
        "value": "#ffffff"
      },
      "brand": {
        "value": "#16394b"
      }
    },
    "text": {
      "subdued": {
        "value": "#888888"
      },
      "inverse": {
        "value": "{c.bg.default.value}"
      }
    }
  }
}
```
