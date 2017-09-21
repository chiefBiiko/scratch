'use strict'

const { LevenshteinDistance } = require('natural')

module.exports = (text, tokens, targetarray, cutoff) => { // Levenshtein cutoff
  var matches = targetarray.filter(tn => { // exact matches
    return RegExp(`^(.*\s)?${tn}(\s.*)?$`, 'i').test(text)
  })
  if (!matches.length) {                   // approx matches
    matches = targetarray.filter(tn => {
      return tokens.some(tk => {
        return LevenshteinDistance(tk.toLowerCase(), tn.toLowerCase()) <= cutoff
      })
    })
  }
  return matches
}
