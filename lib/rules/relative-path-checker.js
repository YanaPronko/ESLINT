/**
 * @fileoverview rule check is the path relative or not
 * @author pryweb
 */
"use strict";

const path = require('path');
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "rule check is the path relative or not",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    messages: {
      error: "path should be relative acording fsd"
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        // example app/entities/Article
        const importTo = node.source.value;

        // полный путь
        const fromFilename = context.filename

        if (shouldBeRealtive(fromFilename, importTo)) {
          context.report({ node, messageId: 'error' });
        }
      }
    };
  },
};

const layers = {
  widgets: 'widgets',
  entities: 'entitites',
  features: 'features',
  pages: 'pages',
  shared: 'shared'
}

function isRelativePath(path) {
  return path === '.' || path.startsWith('./') || path.startsWith('../')
}

function shouldBeRealtive(from, to) {
  //  entities/Article
  if (isRelativePath(to)) {
    return false;
  }
  const toArray = to.split('/'); //[entities, articles]
  const toLayer = toArray[0];
  const toSlice = toArray[1];

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false
  }
  const projectFrom = from.split('src')[1]
  const fromArray = projectFrom.split(path.sep);

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && fromLayer === toLayer;
}
