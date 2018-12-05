const {
  version: iframeResizerVersion,
} = require('iframe-resizer/package.json');

/**
 * Wrap HTML in full HTML page with CSS & JS assets.
 * @param {string} html - HTML for body
 * @param {string[]} cssUrls - Url for Design System css assets
 * @param {string[]} jsUrls - Url for Design System js assets
 * @param {boolean} [isReadyForIframe=true] - Add JS that prepares it for iFrame use.
 * @returns {string} - Full HTML page.
 */
function wrapHtml(html, cssUrls = [], jsUrls = [], isReadyForIframe = true) {
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  ${cssUrls.map(
    cssUrl => `<link rel="stylesheet" type="text/css" href="${cssUrl}">`,
  )}
  ${
    isReadyForIframe
      ? `<script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/${iframeResizerVersion}/iframeResizer.contentWindow.min.js"></script>`
      : ''
  }
</head>
<body>
${html}
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

module.exports = {
  wrapHtml,
};
