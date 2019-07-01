module.exports = {
  root: true,
  env: {
    node: true
  },
  parser: "vue-eslint-parser",
  extends: [
    "plugin:vue/essential",
    "@vue/prettier",
    "@vue/typescript"
  ],
  globals: {
    api: true
  },
  parserOptions: {
    ecmaVersion: 2018,
    parser: "@typescript-eslint/parser"
  },
  plugins: ['vue', 'prettier'],
  rules: {
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    '@typescript-eslint/interface-name-prefix': 2,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-use-before-define': 1,
    '@typescript-eslint/member-delimiter-style': {
      delimiter: 'none',
      requireLast: true,
    },
    "eqeqeq": 2,
    "no-unused-vars": 2,
    "object-curly-spacing": [1, "always"],
    "no-new-wrappers": 2,
    "vue/no-use-v-if-with-v-for": 0,
    "prettier/prettier": [
      "error",
      {
        arrowParens: 'always',
        requirePragma: true,
        semi: true,
        singleQuote: true,
      }
    ],
    "spaced-comment": 2,
  }
};
