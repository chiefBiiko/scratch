'use strict'

module.exports = function (string) {
  return string.replace(/([^\W_]+[^\s-]*) */g, txt => {
    return `${txt.charAt(0).toUpperCase()}${txt.substr(1).toLowerCase()}`
  })
}
