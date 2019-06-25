/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const { Container } = CompLibrary;
const { GridBlock } = CompLibrary;

function ConfigSchemas(props) {
  const { config: siteConfig, language = '' } = props;
  const { baseUrl, docsUrl } = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  // const supportLinks = [
  //   {
  //     content: `Learn more using the [documentation on this site.](${docUrl(
  //       'doc1.html',
  //     )})`,
  //     title: 'Browse Docs',
  //   },
  //   {
  //     content: 'Ask questions about the documentation and project',
  //     title: 'Join the community',
  //   },
  //   {
  //     content: 'Find out what\'s new with this project',
  //     title: 'Stay up to date',
  //   },
  // ];

  return (
    <div className="docMainWrapper wrapper">
      <link
        rel="stylesheet"
        href="https://unpkg.com/react-table@latest/react-table.css"
      />
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <div id="root--config-schemas"></div>
          {/*<p>This project is maintained by a dedicated group of people.</p>*/}
          {/*<GridBlock contents={supportLinks} layout="threeColumn"/>*/}
        </div>
      </Container>
      <script src="/dist/main.bundle.js"></script>
    </div>
  );
}

module.exports = ConfigSchemas;
