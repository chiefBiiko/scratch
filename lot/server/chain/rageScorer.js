'use strict'

const sentiment = require('sentiment')
const fmtContent = require('./../helpers/fmtContent')

module.exports = (e, next) => {
  if (e.response) next(null, e)
  if (sentiment(e.text).score < 0) {
    e.response = fmtContent.humanSupport()
  }
  next(null, e)
  return e // 4 dev tests only
}
