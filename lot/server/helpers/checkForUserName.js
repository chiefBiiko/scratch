'use strict'

const replaceOrFalsy = require('./replaceOrFalsy')
const toTitleCase = require('./toTitleCase')

module.exports = text => {
  const matched = replaceOrFalsy(text, /^.*my\s*name\s*is\s*([a-z]+).*$/i, '$1')
  return matched ? toTitleCase(matched) : matched
}
