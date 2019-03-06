import React from 'react';
import PropTypes from 'prop-types';
import pretty from 'pretty';
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
import { PreStyles, CodeStyles, PrismTokenStyles } from './pretty-code.styles';
import mapChildren from './map-children';

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

export const isLanguageSupported = lang => languageList.includes(lang);

availableLanguages.sort();

const CodeSnippet = ({ language, code = '' }) => {
  // check to make sure the language being used is registered
  if (process.env.NODE_ENV !== 'production') {
    if (!refractor.registered(language)) {
      // eslint-disable-next-line no-console
      console.warn(
        `No language definitions for '${language}' seems to be registered, did you forget to call \`Refractor.registerLanguage()\`?`,
      );
      return (
        <p>{`No language definitions for '${language}' seems to be registered`}</p>
      );
    }
  }

  const preppedCode =
    language === 'html' ? pretty(code.trim(), { ocd: true }) : code.trim();

  const ast = refractor.highlight(code, language);

  // @todo: possibly add marker support like in react-refractor
  // if (props.markers && props.markers.length > 0) {
  //   ast = addMarkers(ast, { markers: props.markers });
  // }
  const formattedCode =
    ast.length === 0 ? preppedCode : ast.map(mapChildren(0));

  return (
    <PreStyles>
      <CodeStyles>
        <PrismTokenStyles>{formattedCode}</PrismTokenStyles>
      </CodeStyles>
    </PreStyles>
  );
};

CodeSnippet.propTypes = {
  language: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
};

export default CodeSnippet;
