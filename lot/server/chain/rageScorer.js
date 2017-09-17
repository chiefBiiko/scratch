'use strict'

const sentiment = require('sentiment')
const fmtContent = require('./../helpers/fmtContent')

module.exports = (e, next) => {
  if (e.response) next(null, e)
  if (sentiment(e.text).score < 0) {
  //const session = SESSIONS.get(e.user.id)
    e.response = fmtContent.humanSupport()
  //session.ws.send(JSON.stringify({ text: fmtContent.humanSupport() }))
  //return
  }
  next(null, e)
  return e // 4 dev tests only, ignored by botpress
}
