'use strict'

const { LevenshteinDistance } = require('natural')

module.exports = (text, tokens, targetarray, cutoff) => { // Levenshtein cutoff
  const exact = targetarray.filter(tname => RegExp(tname, 'i').test(text))
  var approx = {}
  if (!exact.length) {
    approx = targetarray.reduce((acc, tname) => { // arr 2 obj
      const approxd = tokens.filter(token => {
        return LevenshteinDistance(token.toLowerCase(), tname.toLowerCase()) <=
          cutoff
      })[0]
      if (approxd) acc[approxd] = tname
      return acc
    }, {})
  }
  return { exact: exact, approx: approx }
}
