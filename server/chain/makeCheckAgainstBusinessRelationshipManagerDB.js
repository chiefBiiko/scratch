'use strict'

const fs = require('fs')
const path = require('path')

const fmtFAQ = require('./../helpers/fmtFAQ')

module.exports = BusinessRelationshipManagerDB => {
  const checkAgainstBusinessRelationshipManagerDB = (e, next) => {
    if (Object.keys(e.response).length) next(null, e)
    if (/my.{0,23}contact|business\s+relationship\s+manager/i.test(e.text)) {
      e.response = fmtFAQ.whoIsMyBRM(BusinessRelationshipManagerDB[e.gma_id])
    }
    next(null, e)
    return e // 4 dev only
  }
  // returning a closure
  return checkAgainstBusinessRelationshipManagerDB
}
