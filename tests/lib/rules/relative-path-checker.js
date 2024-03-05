/**
 * @fileoverview rule check is the path relative or not
 * @author pryweb
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/relative-path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});
ruleTester.run('relative-path-checker', rule, {
  valid: [
    {
      filename: 'C:\\Учеба\\ULBI\\bigProject\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      filename: 'C:\\Учеба\\ULBI\\bigProject\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: 'path should be relative acording fsd' }],
      options: [
        {
          alias: '@',
        },
      ],
    },
    {
      filename: 'C:\\Учеба\\ULBI\\bigProject\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: 'path should be relative acording fsd' }],
    },
  ],
});
