import {
  LitElement,
  css,
  customElement,
  property,
  html,
} from 'lit-element';

@customElement('bs-button')
export class MyButton extends LitElement {
  @property() size = 'md';
  @property() type = 'primary';
  @property({
    type: Boolean
  }) outlined = false;
  @property({
    type: Boolean
  }) disabled = false;

  static get styles() {
    return css`
      .btn-sm {
        font-size: .8rem;
      }
      .btn-md {
        font-size: 1rem;
      }
      .btn-lg {
        font-size: 1.2rem;
      }
    `;
  }

  render() {
    const classes = [
      'bootstrap',
      'btn',
      this.outlined ? `btn-outline-${this.type}` : `btn-${this.type}`,
      this.disabled ? 'disabled' : '',
      this.size ? `btn-${this.size}` : '',
    ].join(' ');
    return html`
      <link rel="stylesheet" href="/css/bootstrap.css">
      <button class="${classes}">
        <slot></slot>
      </button>
    `;
  }
}
