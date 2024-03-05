/**
 * @fileoverview rule check is the path relative or not
 * @author pryweb
 */
"use strict";

const path = require('path');
const {isRelativePath} = require('../helpers');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'rule check is the path relative or not',
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    messages: {
      error: 'path should be relative acording fsd',
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
          },
        },
      },
    ], // Add a schema if the rule has options
  },

  create(context) {
    const alias = context.options[0] && context.options[0].alias || '';
    return {
      ImportDeclaration(node) {
        try {
          const value = node.source.value;
          // example app/entities/Article
          const importTo = alias ? value.replace(`${alias}/`, '') : value;

          // полный путь
          const fromFilename = context.filename;

          if (shouldBeRelative(fromFilename, importTo)) {
            context.report({
              node,
              messageId: 'error',
              fix: (fixer) => {
                const normalizedPath = getNormalizedCurrentFilePath(
                  fromFilename
                ) // /entities/Article/Article.tsx
                  .split('/')
                  .slice(0, -1)
                  .join('/');
                let relativePath = path
                  .relative(normalizedPath, `/${importTo}`)
                  .split('\\')
                  .join('/');

                if (!relativePath.startsWith('.')) {
                  relativePath = './' + relativePath;
                }

                return fixer.replaceText(node.source, `'${relativePath}'`);
              },
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
    };
  },
};

function getNormalizedCurrentFilePath(currentFilePath) {
  const normalizedPath = path.toNamespacedPath(currentFilePath);
  const projectFrom = normalizedPath.split('src')[1];
  return projectFrom.split(path.sep).join('/');
}

const layers = {
  widgets: 'widgets',
  entities: 'entitites',
  features: 'features',
  pages: 'pages',
  shared: 'shared'
}

function shouldBeRelative(from, to) {
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
  const projectFrom = getNormalizedCurrentFilePath(from);
  const fromArray = projectFrom.split('/');

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && fromLayer === toLayer;
}
