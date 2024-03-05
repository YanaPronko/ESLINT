/**
 * @fileoverview should forbidden imports from non-public api
 * @author pryweb
 */
"use strict";

const { isRelativePath } = require('../helpers');
const micromatch = require('micromatch');
const path = require('path');


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'should forbidden imports from non-public api',
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    messages: {
      error: 'imports should be from public API (index.ts)',
      testingError: 'Forbidden import data from testing API (.testing)',
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
          },
          testFilesPatterns: {
            type: 'array',
          },
        },
      },
    ], // Add a schema if the rule has options
  },

  create(context) {
    const { alias = '', testFilesPatterns= [] } = context.options[0] ?? {};

    const chekingLayers = {
      widgets: 'widgets',
      entities: 'entitites',
      features: 'features',
      pages: 'pages',
    };

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        // example app/entities/Article
        const importTo = alias ? value.replace(`${alias}/`, '') : value;
        const importSegments = importTo.split('/');
        const isImportNotFromPublicAPI = importSegments.length > 2;
        const isTestingPublicAPI = importSegments[2] === 'testing' && importSegments.length < 4;
        const layer = importSegments[0];
        const slice = importSegments[1];

        if (!chekingLayers[layer]) {
          return;
        }

        if (isRelativePath(importTo)) {
          return;
        }

        if (isImportNotFromPublicAPI && !isTestingPublicAPI) {
          context.report({
            node,
            messageId: 'error',
            fix: (fixer) => {
              return fixer.replaceText(
                node.source,
                `'${alias}/${layer}/${slice}'`
              );
            },
          });
        }

        if (isTestingPublicAPI) {
          const currentFilePath = context.filename;
          const normalizedPath = path.toNamespacedPath(currentFilePath);

          const isCurrentFileTesting = testFilesPatterns.some(pattern => micromatch.isMatch(normalizedPath, pattern));

          if (!isCurrentFileTesting) {
            context.report({ node, messageId: "testingError" })
          }
        }
      },
    };
  },
};
