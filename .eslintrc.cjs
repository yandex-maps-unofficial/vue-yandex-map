module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/airbnb',
  ],
  plugins: [
    '@typescript-eslint/eslint-plugin',
  ],
  globals: {
    ymaps: 'readonly',
    ymaps3: 'readonly',
  },
  rules: {
    'no-console': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'no-param-reassign': 0,
    'consistent-return': 0,
    'no-plusplus': 0,
    'prefer-destructuring': 0,
    'max-len': 'off',
    'vue/max-len': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: { max: 4 },
      multiline: { max: 1 },
    }],
    'vue/no-v-html': 0,
    'vue/require-default-prop': 0,
    // Тут нам поможет rollup
    'import/no-extraneous-dependencies': 'off',
    'no-promise-executor-return': 'off',
    'object-shorthand': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['error'],
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-dupe-class-members': ['error'],
    'no-useless-constructor': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error', {
        'functions': false,
      },
    ],
    '@typescript-eslint/no-useless-constructor': [
      'error',
    ],
    'space-before-function-paren': 'off',
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  ignorePatterns: [
    'dist',
    'nuxt2-plugin.js',
  ],
};
