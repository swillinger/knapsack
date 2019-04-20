/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const { default: SchemaTable } = require('@knapsack/schema-table');
const designTokens = require('@basalt/knapsack/src/schemas/knapsack-design-tokens.schema.js');
const settings = require('@basalt/knapsack/src/schemas/knapsack.settings.schema.js');
const patternTemplates = require('@basalt/knapsack/src/schemas/pattern-templates.schema.json');
const patternMeta = require('@basalt/knapsack/src/schemas/pattern-meta.schema');
const patternWithMeta = require('@basalt/knapsack/src/schemas/pattern-w-meta.schema');
const patternFull = require('@basalt/knapsack/src/schemas/pattern.schema');

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
          <header className="postHeader">
            <h1>Config Schemas</h1>
          </header>
          <h2>Pattern Template Schema</h2>
          <SchemaTable schema={patternTemplates.items}/>

// a
          <h2>{designTokens.knapsackDesignTokenSchema.title}</h2>
          <SchemaTable schema={designTokens.knapsackDesignTokenSchema}/>

          <h2>{settings.title}</h2>
          <SchemaTable schema={settings}/>

          <h2>{patternMeta.title}</h2>
          <SchemaTable schema={patternMeta}/>

          <h2>{patternWithMeta.title}</h2>
          <SchemaTable schema={patternWithMeta}/>

// a
          <h2>{patternFull.title}</h2>
          <SchemaTable schema={patternFull}/>

          {/*<p>This project is maintained by a dedicated group of people.</p>*/}
          {/*<GridBlock contents={supportLinks} layout="threeColumn"/>*/}
        </div>
      </Container>
    </div>
  );
}

module.exports = ConfigSchemas;
