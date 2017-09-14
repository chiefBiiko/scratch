'use strict'

const fs = require('fs')
const path = require('path')
const matchExAx = require('./../helpers/matchExAx')

const FAKE_DB = path.join(__dirname, '..', 'data', 'dev', 'products.json')

module.exports = (jsonfile=FAKE_DB, minutes=2) => {
  var DB = {} // in-memory copy of products collection, updated repeatedly
  // initial fullfillment
  fs.readFile(FAKE_DB, 'utf8', (err, data) => {
    if (err) throw err
    DB = JSON.parse(data)
  })
  // schedule update
  setInterval(() => { // updating DB every minutes
    console.log(`updating DB @ ${new Date().toUTCString()}...`)
    fs.readFile(FAKE_DB, 'utf8', (err, data) => {
      if (err) throw err
      DB = JSON.parse(data)
    })
  }, 1000 * 60 * minutes)
  // assemble factory return
  const checkAgainstDB = (e, next) => { // closes over DB
    // DB subsets
    const productnames = Object.keys(DB)
    const categorynames = [ ...new Set(productnames.map(pname => {
      return DB[pname].category
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
    // put all product hits from DB on e.stash
    e.stash.hitProducts = (productmatches.exact.length ?
      productmatches.exact :
      Object.keys(productmatches.approx).map(key => productmatches.approx[key]))
        .reduce((acc, cur) => {
      acc[cur] = DB[cur]
      return acc
    }, {})
    next(null, e)
    return e // 4 dev tests only, ignored by botpress
  }
  // returning a closure
  return checkAgainstDB
}
