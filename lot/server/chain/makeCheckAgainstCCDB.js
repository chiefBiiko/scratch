'use strict'

const fs = require('fs')
const path = require('path')
const matchExAx = require('./../helpers/matchExAx')

module.exports = CCDB => {

  // assemble factory return
  const checkAgainstCCDB = (e, next) => { // closes over CCDB
    // CCDB subsets
    const productnames = Object.keys(CCDB)
    const categorynames = [ ...new Set(productnames.map(pname => {
      return CCDB[pname].category
    })) ]
    // product/category hits
    console.log('matchExAx inputs', e.text, e.tokens, productnames, 3)
    const productmatches = matchExAx(e.text, e.tokens, productnames, 3)
    const categorymatches = matchExAx(e.text, e.tokens, categorynames, 3)
    console.log('productmatches', productmatches)
    // store exact and approx matched product/category names on e.stash
    e.stash = {}
    e.stash.exactProducts = productmatches.exact
    e.stash.approxProducts = productmatches.approx
    e.stash.exactCategories = categorymatches.exact
    e.stash.approxCategories = categorymatches.approx
    // put all product hits from CCDB on e.stash
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
