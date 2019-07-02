
const shell = require('shelljs');
const watch = require('watch');
const path = require('path');
const pageRoot = path.resolve(__dirname, './src/pages');

// eslint-disable-next-line
watch.watchTree(pageRoot, function (file, curr, prev) {
  if(prev === null ||(curr && curr.size === 0)) {
    shell.exec("node ./route-generator.js");
  }
});