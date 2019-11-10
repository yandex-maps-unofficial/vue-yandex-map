module.exports = {
  "root": true,
  "env": {
    "node": true
  },
  "extends": [
    "plugin:vue/recommended",
    "plugin:jest/recommended",
    "@vue/airbnb"
  ],
  "globals": {
    "ymaps": "readonly"
  },
  "rules": {
    "no-console": 0,
    "import/no-unresolved": 0,
    "import/extensions": 0,
    "import/prefer-default-export": 0,
    "no-param-reassign": 0,
    "consistent-return": 0,
    "no-plusplus": 0,
    "prefer-destructuring": 0,
    "vue/max-attributes-per-line": ['error', {
      singleline: 4,
      multiline: { max: 1, allowFirstLine: false },
    }],
    "vue/no-v-html": 0,
    "vue/require-default-prop": 0,
    
  },
  "parserOptions": {
    "parser": "babel-eslint"
  }
}
