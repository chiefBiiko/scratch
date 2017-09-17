'use strict'

const _ = require('lodash')
const matchExAx = require('./../helpers/matchExAx')

module.exports = CCDB => {

  // assemble factory return
  const checkAgainstCCDB = (e, next) => { // closes over CCDB
    // CCDB subsets
    const countrynames = _.keys(CCDB.name2cc)
    const countrycodes = _.keys(CCDB.cc2name)

    // code/name hit arrays
  //console.log('matchExAx inputs', e.text, e.tokens, countrynames, 3)
    e.stash = {}
    e.stash.countrynames = matchExAx(e.text, e.tokens, countrynames, 3)
    e.stash.countrycodes = countrycodes
      .filter(cc => RegExp(`[^a-zA-Z0-9]${cc}[^a-zA-Z0-9]`).test(e.text))
  //const codematches = matchExAx(e.text, e.tokens, countrycodes, 0)

    // store exact and approx matched product/category names on e.stash

    // e.stash.exactProducts = productmatches.exact
    // e.stash.approxProducts = productmatches.approx
    // e.stash.exactCategories = categorymatches.exact
    // e.stash.approxCategories = categorymatches.approx
    // put all product hits from CCDB on e.stash
    // TODO
    e.stash.hitProducts = (productmatches.exact.length ?
      productmatches.exact :
      Object.keys(productmatches.approx).map(key => productmatches.approx[key]))
        .reduce((acc, cur) => {
      acc[cur] = CCDB[cur]
      return acc
    }, {})
    next(null, e)
    return e // 4 dev tests only, ignored by botpress
  }
  // returning a closure
  return checkAgainstCCDB
}
