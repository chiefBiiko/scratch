'use strict'

const fs = require('fs')
const path = require('path')

const fmtFAQ = require('./../helpers/fmtFAQ')

module.exports = BRM_DB => {
  const requestsBRM = (e, next) => {
    if (Object.keys(e.response).length) next(null, e)
    if (/my.{0,23}contact|business\s+relationship\s+manager/i.test(e.text)) {
      e.sid = '419' // 4 DEV ONLY!!!
      e.response = fmtFAQ.whoIsMyBRM(BRM_DB[e.sid])
    }
    next(null, e)
    return e // 4 dev only
  }
  // returning a closure
  return requestsBRM
}
