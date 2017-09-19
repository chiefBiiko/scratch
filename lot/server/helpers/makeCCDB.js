'use strict'

const fs = require('fs')

module.exports = (CCDB_PATH, minutes = 1) => {
  var CCDB = JSON.parse(fs.readFileSync(CCDB_PATH, 'utf8'))
  // schedule update
  setInterval(() => { // updating DB every minutes
    fs.readFile(CCDB_PATH, 'utf8', (err, data) => {
      if (err) throw err
      console.log(`updating DB @ ${new Date().toUTCString()}...`)
      CCDB = JSON.parse(data)
    })
  }, 1000 * 60 * minutes)
  // returning an updating DB
  return CCDB
}
