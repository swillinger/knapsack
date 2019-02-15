Alerts are available for any length of text, as well as an optional dismiss button. For proper styling, use one of the eight required contextual classes (e.g., .alert-success). For inline dismissal, use the alerts jQuery plugin.

#### Example Usage

```html
<div class="alert alert-primary" role="alert">
  This is a primary alert—check it out!
</div>
```

> Note: Conveying meaning to assistive technologies
        Using color to add meaning only provides a visual indication, which will not be conveyed to users of assistive technologies – such as screen readers. Ensure that information denoted by the color is either obvious from the content itself (e.g. the visible text), or is included through alternative means, such as additional text hidden with the .sr-only class.

#### Additional content

Alerts can also contain additional HTML elements like headings, paragraphs and dividers.

```html
<div class="alert alert-success" role="alert">
  <h4 class="alert-heading">Well done!</h4>
  <p>Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.</p>
  <hr>
  <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
</div>
```

#### Dismissing

Using the alert JavaScript plugin, it’s possible to dismiss any alert inline. Here’s how:

- Be sure you’ve loaded the alert plugin, or the compiled Bootstrap JavaScript.
- If you’re building our JavaScript from source, it requires util.js. The compiled version includes this.
- Add a dismiss button and the .alert-dismissible class, which adds extra padding to the right of the alert and positions the .close button.
- On the dismiss button, add the data-dismiss="alert" attribute, which triggers the JavaScript functionality. Be sure to use the <button> element with it for proper behavior across all devices.
- To animate alerts when dismissing them, be sure to add the .fade and .show classes.
