'use strict'

const replaceOrFalsey = require('./replaceOrFalsey')
const toTitleCase = require('./toTitleCase')

module.exports = text => {
  const matched = replaceOrFalsey(text, /^.*my\s*name\s*is\s*([a-z]+).*$/i, '$1')
  return matched ? toTitleCase(matched) : matched
}
