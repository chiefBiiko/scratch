'use strict'

module.exports = (string, find, replace) => {
  const replaced = string.replace(find, replace)
  return replaced !== string ? replaced : ''
}
