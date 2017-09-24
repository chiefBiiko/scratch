'use strict'

module.exports = (text, find, replace) => {
  const replaced = text.replace(find, replace)
  return replaced !== text ? replaced : ''
}
