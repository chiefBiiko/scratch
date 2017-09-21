'use strict'

const matchExAx = require('./../helpers/matchExAx')

module.exports = CCDB => {
  // assemble factory return
  const checkAgainstCCDB = (e, next) => { // closes over CCDB
    if (Object.keys(e.response).length) next(null, e)
    // CCDB subsets
    const countrynames = Object.keys(CCDB.nameToCode)
    const countrycodes = Object.keys(CCDB.codeToName)
    // code/name hit arrays
    const namematches = matchExAx(e.text, e.tokens, countrynames, 1)
    const codematches = countrycodes
      .filter(cc => RegExp(`^(.*\s)?${cc}(\s.*)?$`).test(e.text))
    // store country code mappings on e.stash
    e.stash = {
      nameToCode: namematches.reduce((acc, cur) => {
        acc[cur] = CCDB.nameToCode[cur]
        return acc
      }, {}),
      codeToName: codematches.reduce((acc, cur) => {
        acc[cur] = CCDB.codeToName[cur]
        return acc
      }, {})
    }
    next(null, e)
    return e // 4 dev tests only
  }
  // returning a closure
  return checkAgainstCCDB
}
