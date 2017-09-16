'use strict'

const fs = require('fs')

module.exports = (CC_DB, minutes = 2) => {
  var DB = {} // in-memory copy of products collection, updated repeatedly
  // initial fullfillment
  fs.readFile(CC_DB, 'utf8', (err, data) => {
    if (err) throw err
    DB = JSON.parse(data)
  })
  // schedule update
  setInterval(() => { // updating DB every minutes
    console.log(`updating DB @ ${new Date().toUTCString()}...`)
    fs.readFile(CC_DB, 'utf8', (err, data) => {
      if (err) throw err
      DB = JSON.parse(data)
    })
  }, 1000 * 60 * minutes)
  // returning an updating DB
  return DB
}
