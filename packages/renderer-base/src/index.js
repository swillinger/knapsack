/* eslint-disable class-methods-use-this, no-empty-function */
class BedrockRenderer {
  constructor() {}

  getHead({ cssUrls = [], headJsUrls = [] }) {
    return `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          ${cssUrls.map(
            cssUrl =>
              `<link rel="stylesheet" type="text/css" href="${cssUrl}">`,
          )}
          ${headJsUrls.map(jsUrl => `<script src="${jsUrl}"></script>`)}
    </head>
    <body>
    `;
  }

  getFoot({ jsUrls = [] } = {}) {
    return `
    ${jsUrls.map(jsUrl => `<script src="${jsUrl}"></script>`)}
<style>
  body {
    display: flex;
    justify-content: center;
    align-items: center;
  }
 
</style>
 <script>
  /**
  * Prevents the natural click behavior of any links within the iframe.
  * Otherwise the iframe reloads with the current page or follows the url provided.
  */
  const links = Array.prototype.slice.call(document.querySelectorAll('a'));
  links.forEach(function(link) {
    link.addEventListener('click', function(e){e.preventDefault();});
  });
</script>
</body>
</html>
    `;
  }

  wrapHtml({ html, cssUrls = [], jsUrls = [], headJsUrls = [] }) {
    return `
${this.getHead({ cssUrls, headJsUrls })}
${html}
${this.getFoot({ jsUrls })}
`;
  }
}
module.exports = BedrockRenderer;
