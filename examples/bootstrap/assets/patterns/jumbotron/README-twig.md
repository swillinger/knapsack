A lightweight, flexible component that can optionally extend the entire viewport to showcase key marketing messages on your site.

To make the jumbotron full width, and without rounded corners, add the .jumbotron-fluid modifier class and add a .container or .container-fluid within.

#### Example Usage

```twig
{% include '@components/jumbotron.twig' with {
  title: 'Jumbotron',
  body: 'This is the body copy.'
} only %}
```
