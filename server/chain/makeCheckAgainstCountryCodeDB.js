'use strict'

const matchExAx = require('./../helpers/matchExAx')

module.exports = CountryCodeDB => {
  // assemble factory return
  const checkAgainstCountryCodeDB = (e, next) => { // closes over CountryCodeDB
    if (Object.keys(e.response).length) next(null, e)
    // CountryCodeDB subsets
    const countrynames = Object.keys(CountryCodeDB.nameToCode)
    const countrycodes = Object.keys(CountryCodeDB.codeToName)
    // code/name hit arrays
    const namematches = matchExAx(e.text, e.tokens, countrynames, 1)
    const codematches = countrycodes
      .filter(cc => RegExp(`^(.*\s)?${cc}(\s.*)?$`).test(e.text))
    // store country code mappings on e.stash
    e.stash = {
      nameToCode: namematches.reduce((acc, cur) => {
        acc[cur] = CountryCodeDB.nameToCode[cur]
        return acc
      }, {}),
      codeToName: codematches.reduce((acc, cur) => {
        acc[cur] = CountryCodeDB.codeToName[cur]
        return acc
      }, {})
    }
    next(null, e)
    return e // 4 dev tests only
  }
  // returning a closure
  return checkAgainstCountryCodeDB
}
