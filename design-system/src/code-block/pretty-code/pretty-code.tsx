import React from 'react';
import PropTypes from 'prop-types';
import js from 'refractor/lang/javascript';
import json from 'refractor/lang/json';
import jsx from 'refractor/lang/jsx';
import handlebars from 'refractor/lang/handlebars';
import markdown from 'refractor/lang/markdown';
import markup from 'refractor/lang/markup';
import markupTemplating from 'refractor/lang/markup-templating';
import scss from 'refractor/lang/scss';
import css from 'refractor/lang/css';
import cssExtras from 'refractor/lang/css-extras';
import php from 'refractor/lang/php';
import twig from 'refractor/lang/twig';
import bash from 'refractor/lang/bash';
import { mapWithDepth } from './map-children';
import './pretty-code.scss';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const refractor = require('refractor/core.js');

export const availableLanguages = [];
[
  js,
  json,
  jsx,
  markdown,
  markup,
  handlebars,
  php,
  markupTemplating,
  scss,
  css,
  cssExtras,
  twig,
  bash,
].forEach(lang => {
  refractor.register(lang);
  availableLanguages.push(lang.displayName, ...lang.aliases);
});

// This is a currated suggested list useful for Schema Forms. We `filter` it at end to ensure it is correct.
export const languageList = [
  'scss',
  'css',
  'javascript',
  'jsx',
  'twig',
  'html',
  'handlebars',
  'php',
  'json',
  'bash',
].filter(lang => availableLanguages.includes(lang));

export const isLanguageSupported = (lang: string): boolean =>
  languageList.includes(lang);

availableLanguages.sort();

type Props = {
  language: string;
  code: string;
};

export const CodeSnippet: React.FC<Props> = ({
  language,
  code = '',
}: Props) => {
  let formattedCode: string;
  // check to make sure the language being used is registered
  if (language && refractor.registered(language)) {
    const preppedCode = code?.trim();

    const ast = refractor.highlight(code, language);

    // @todo: possibly add marker support like in react-refractor
    // if (props.markers && props.markers.length > 0) {
    //   ast = addMarkers(ast, { markers: props.markers });
    // }
    formattedCode = ast.length === 0 ? preppedCode : ast.map(mapWithDepth(0));
  } else {
    formattedCode = code;
    console.warn(
      `No language definitions for '${language}' seems to be registered, did you forget to call \`Refractor.registerLanguage()\`?`,
    );
  }

  return (
    <pre className="ks-pretty-code">
      <code className="ks-pretty-code__code">
        <div className="ks-pretty-code__prism-token">{formattedCode}</div>
      </code>
    </pre>
  );
};
