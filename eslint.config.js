/* eslint-disable @typescript-eslint/no-require-imports */
const js = require('@eslint/js')
const globals = require('globals')
const epPrettierRecommended = require('eslint-plugin-prettier/recommended')
// 引入有问题
// const ecTaro = require('eslint-config-taro')
const epImport = require('eslint-plugin-import')
const epReact = require('eslint-plugin-react')
const epReactHooks = require('eslint-plugin-react-hooks')
const tseslint = require('typescript-eslint')

module.exports = tseslint.config(
  js.configs.recommended,
  // ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  epPrettierRecommended,
  {
    languageOptions: {
      globals: {...globals.browser, ...globals.es2022, ...globals.node, ...globals.jest},
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    plugins: {
      react: epReact,
      import: epImport,
      'react-hooks': epReactHooks,
    },
    rules: {
      ...epReactHooks.configs.recommended.rules,

      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',

      // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
      'default-case': 'off',
      // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
      'no-dupe-class-members': 'off',
      // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
      'no-undef': 'off',

      'no-empty': 'off',

      'no-array-constructor': 'off',
      'no-use-before-define': 'off',
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      'no-useless-catch': 'off',
      'no-useless-constructor': 'off',
      // https://github.com/typescript-eslint/typescript-eslint/issues/2471
      'no-shadow': 'off',
      'no-restricted-globals': 'off',

      // Add TypeScript specific rules (and turn off ESLint equivalents)
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/no-array-constructor': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-use-before-define': [
        'warn',
        {
          functions: false,
          classes: false,
          variables: false,
          typedefs: false,
        },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      // '@typescript-eslint/no-unused-vars': [
      //   'warn',
      //   {
      //     args: 'none',
      //     ignoreRestSiblings: true,
      //     varsIgnorePattern: '^Nerv|^React|^_',
      //   },
      // ],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-useless-constructor': 'warn',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/order': [
        'error',
        {
          pathGroups: [
            {
              pattern: '@/**',
              group: 'external',
              position: 'after',
            },
          ],
          groups: [
            'builtin',
            'external',
            'type',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
        },
      ],
    },
  },
  {
    ignores: ['packages/**/es', 'packages/**/dist', 'node_modules'],
  },
)
