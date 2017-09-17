'use strict'

const { LevenshteinDistance } = require('natural')

module.exports = (text, tokens, targetarray, cutoff) => { // Levenshtein cutoff
  var matches = targetarray.filter(tn => RegExp(tn, 'i').test(text)) // exact
  if (!matches.length) {                                             // approx
    matches.concat(targetarray.filter(tn => {
      return tokens.some(tk => {
        return LevenshteinDistance(tk.toLowerCase(), tn.toLowerCase()) <= cutoff
      })
    }))
  }
  return matches
}
