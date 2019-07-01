module.exports = {
  presets: [
    "@vue/app",
    [
      "@babel/preset-env",
      {
        "targets": {
          "esmodules": true
        }
      }
    ]
  ],
  plugins: [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    // https://babeljs.io/docs/en/babel-plugin-transform-runtime/
    "@babel/plugin-transform-runtime",
    "dynamic-import-webpack"
  ]
};
