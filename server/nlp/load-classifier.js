// mini module that exports a factory to restore a naive bayes classifier

const fs = require('fs')
const natural = require('natural')

module.exports = function(fpath) {
  if (!fs.existsSync(fpath)) throw new Error('no such file')
  const raw = fs.readFileSync(fpath, 'utf8')
  return natural.BayesClassifier.restore(JSON.parse(raw))
}
