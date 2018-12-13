import React from 'react';
import pretty from 'pretty';

// Load any languages you want to use from `refractor`
import js from 'refractor/lang/javascript';
import json from 'refractor/lang/json';
import jsx from 'refractor/lang/jsx';
import markdown from 'refractor/lang/markdown';
import markup from 'refractor/lang/markup';
import markupTemplating from 'refractor/lang/markup-templating';
import scss from 'refractor/lang/scss';
import twig from 'refractor/lang/twig';
import bash from 'refractor/lang/bash';
import { PreStyles, CodeStyles, PrismTokenStyles } from './pretty-code.styles';
import mapChildren from './map-children';

const refractor = require('refractor/core.js');

// Then register them
refractor.register(js);
refractor.register(json);
refractor.register(jsx);
refractor.register(markdown);
refractor.register(markup);
refractor.register(markupTemplating);
refractor.register(scss);
refractor.register(twig);
refractor.register(bash);

const CodeSnippet = props => {
  // check to make sure the language being used is registered
  if (process.env.NODE_ENV !== 'production') {
    if (!refractor.registered(props.language)) {
      // eslint-disable-next-line no-console
      console.warn(
        `No language definitions for '${
          props.language
        }' seems to be registered, did you forget to call \`Refractor.registerLanguage()\`?`,
      );
    }
  }

  const code =
    props.language === 'html'
      ? pretty(props.code.trim(), { ocd: true })
      : props.code.trim();

  const ast = refractor.highlight(code, props.language);

  // @todo: possibly add marker support like in react-refractor
  // if (props.markers && props.markers.length > 0) {
  //   ast = addMarkers(ast, { markers: props.markers });
  // }
  const formattedCode = ast.length === 0 ? code : ast.map(mapChildren(0));

  return (
    <PreStyles>
      <CodeStyles {...props}>
        <PrismTokenStyles>{formattedCode}</PrismTokenStyles>
      </CodeStyles>
    </PreStyles>
  );
};

export default CodeSnippet;
