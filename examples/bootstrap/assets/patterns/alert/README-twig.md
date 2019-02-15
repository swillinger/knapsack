Alerts are available for any length of text, as well as an optional dismiss button. For proper styling, use one of the eight required contextual classes (e.g., .alert-success). For inline dismissal, use the alerts jQuery plugin.

#### Example Usage

```twig
{% include '@components/alert.twig' with {
  message: 'Error - something went wrong.',
  type: 'error'
} only %}
```
