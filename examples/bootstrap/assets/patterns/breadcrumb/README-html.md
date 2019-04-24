#### Separators

Separators are automatically added in CSS through `::before` and content. They can be changed by changing `$breadcrumb-divider`. The quote function is needed to generate the quotes around a string, so if you want `>` as separator, you can use this:

```scss
$breadcrumb-divider: quote(">");
```

It’s also possible to use a base64 embedded SVG icon:

```scss
$breadcrumb-divider: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxwYXRoIGQ9Ik0yLjUgMEwxIDEuNSAzLjUgNCAxIDYuNSAyLjUgOGw0LTQtNC00eiIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+);
```

The separator can be removed by setting `$breadcrumb-divider` to none:

```scss
$breadcrumb-divider: none;
```


