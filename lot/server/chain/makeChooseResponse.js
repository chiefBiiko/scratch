'use strict'

const fmtContent = require('./../helpers/fmtContent')

module.exports = SESSIONS => {
  const chooseResponse = (e, next) => {
    if (e.response) next(null, e)
    const session = SESSIONS.get(e.user.id)
     // ...ask question and set session.onyes IF anything is approx or unclear
    if (Object.keys(e.stash.nameToCode).length) {
      const key = Object.keys(e.stash.nameToCode)[0]
      e.response = fmtContent.nameToCode(key, e.stash.nameToCode[key])
    } else if (Object.keys(e.stash.codeToName).length) {
      const key = Object.keys(e.stash.codeToName)[0]
      e.response = fmtContent.codeToName(key, e.stash.codeToName[key])
    } else if (!e.response) {
      e.response = fmtContent.fallback()
    }
    SESSIONS.set(e.user.id, session) // y does this seem not to be obligatory?
    next(null, e)
    return e // 4 dev tests only
  }
   // returning a closure
  return chooseResponse
}
