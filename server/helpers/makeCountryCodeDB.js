'use strict'

const fs = require('fs')

module.exports = (COUNTRY_CODE_DB_PATH, minutes = 1) => {
  var CountryCodeDB =
    JSON.parse(fs.readFileSync(COUNTRY_CODE_DB_PATH, 'utf8'))
  // schedule update
  setInterval(() => { // updating DB every minutes
    fs.readFile(COUNTRY_CODE_DB_PATH, 'utf8', (err, data) => {
      if (err) throw err
      console.log(`[updating DB @ ${new Date().toUTCString()}...]`)
      CountryCodeDB = JSON.parse(data)
    })
  }, 1000 * 60 * minutes)
  // returning an updating DB
  return CountryCodeDB
}
