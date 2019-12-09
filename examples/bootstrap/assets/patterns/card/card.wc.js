import { LitElement, css, customElement, property, html } from 'lit-element';

@customElement('bs-card')
export class MyButton extends LitElement {
  @property() textAlign = 'left';
  @property() imgSrc = '';
  @property() cardTitle = '';
  @property() cardSubTitle = '';

  render() {
    const classes = ['card', `text-${this.textAlign}`].join(' ');
    return html`
      <link rel="stylesheet" href="/css/bootstrap.css" />
      <div class="${classes}">
        ${this.imgSrc ? html`<img class="card-img-top" src="${this.imgSrc}" />` : ''}
        <div class="card-body">
          <h5 class="card-title">${this.cardTitle}</h5>
          ${this.cardSubTitle
            ? html`
            <h6 class="card-subtitle mb-2 text-muted">${this.cardSubTitle}</h6>`
            : ''}
          <p class="card-text">
            ${this.cardBody}
            <slot name="body"></slot>
          </p>
          <slot></slot>
        </div>
      </div>
    `;
  }
}
