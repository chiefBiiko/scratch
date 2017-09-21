'use strict'

const sentiment = require('sentiment')
const fmtGeneric = require('./../helpers/fmtGeneric')

module.exports = (e, next) => {
  if (e.response)  next(null, e)
  if (sentiment(e.text).score < 0) e.response = fmtGeneric.humanSupport().text
  next(null, e)
  return e // 4 dev tests only
}
