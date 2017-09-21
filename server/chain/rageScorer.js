'use strict'

const sentiment = require('sentiment')
const fmtGeneric = require('./../helpers/fmtGeneric')

module.exports = (e, next) => {
  if (Object.keys(e.response).length)  next(null, e)
  if (sentiment(e.text).score < 0) e.response = fmtGeneric.humanSupport()
  next(null, e)
  return e // 4 dev tests only
}
