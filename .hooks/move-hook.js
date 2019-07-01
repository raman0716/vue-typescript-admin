/* eslint-disable */
const fs = require('fs-extra')
const path = require('path')
const root = path.resolve(__dirname, '../')
fs.copy(
  `${root}/.hooks/pre-commit`,
  `${root}/.git/hooks/pre-commit`,
  err => {
    if (err) {
      console.log(err)
      return
    }
  }
)