/**
 * @fileoverview should check imports
 * @author pryweb
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/layers-import"),
  RuleTester = require("eslint").RuleTester;

const aliasOptions = [
  {
    alias: '@'
  }
];

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});
ruleTester.run('layers-import', rule, {
  valid: [
    {
      filename: 'C:\\Учеба\\ULBI\\bigProject\\src\\features\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/shared/Button.tsx'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Учеба\\ULBI\\bigProject\\src\\features\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Учеба\\ULBI\\bigProject\\src\\app\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Учеба\\ULBI\\bigProject\\src\\widgets\\pages',
      code: "import { useLocation } from 'react-router-dom'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Учеба\\ULBI\\bigProject\\src\\app\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'redux'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Учеба\\ULBI\\bigProject\\srcsrc\\index.tsx',
      code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Учеба\\ULBI\\bigProject\\src\\entities\\Article.tsx',
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      errors: [],
      options: [
        {
          alias: '@',
          ignoreImportPatterns: ['**/StoreProvider'],
        },
      ],
    },
  ],

  invalid: [
    {
      filename: 'C:\\Учеба\\ULBI\\bigProject\\src\\entities\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Articl'",
      errors: [
        {
          message:
            'Forbidden to import from higher layer(e.g. from pages to shared)',
        },
      ],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Учеба\\ULBI\\bigProject\\src\\features\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [
        {
          message:
            'Forbidden to import from higher layer(e.g. from pages to shared)',
        },
      ],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Учеба\\ULBI\\bigProject\\src\\entities\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [
        {
          message:
            'Forbidden to import from higher layer(e.g. from pages to shared)',
        },
      ],
      options: aliasOptions,
    },
  ],
});
