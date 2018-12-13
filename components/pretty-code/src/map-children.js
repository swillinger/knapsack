import React from 'react';

// ported from https://github.com/rexxars/react-refractor/blob/master/src/mapChildren.js

/**
 * Utility function to help render an AST tree into the VDOM
 * @param {number} depth - the level of depth of the AST tree being transformed
 * @returns {any} - returns the react-renderable bit of DOM
 */
export function mapWithDepth(depth) {
  return function mapChildrenWithDepth(child, i) {
    // eslint-disable-next-line no-use-before-define
    return mapChild(child, i, depth);
  };
}

/**
 * Utility function to help render a specific AST tree child into the VDOM
 * @param {any} child - the AST tree child being converted
 * @param {number} i - the index of the AST child?
 * @param {number} depth - depth of the current AST tree child?
 * @returns {any} - returns the child element of the AST tree being react-renderable
 */
export function mapChild(child, i, depth) {
  if (child.tagName) {
    const className =
      child.properties && Array.isArray(child.properties.className)
        ? child.properties.className.join(' ')
        : child.properties.className;

    return React.createElement(
      child.tagName,
      Object.assign({ key: `fract-${depth}-${i}` }, child.properties, {
        className,
      }),
      child.children && child.children.map(mapWithDepth(depth + 1)),
    );
  }

  return child.value;
}

export default mapWithDepth;
