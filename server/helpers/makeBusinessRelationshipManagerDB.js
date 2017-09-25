'use strict'

const fs = require('fs')

module.exports = BUSINESS_RELATIONSHIP_MANAGER_DB_PATH => {
  return JSON.parse(
    fs.readFileSync(BUSINESS_RELATIONSHIP_MANAGER_DB_PATH, 'utf8')
  )
}
