'use strict'

const fmtGeneric = require('./../helpers/fmtGeneric')
const fmtFAQ = require('./../helpers/fmtFAQ')

module.exports = SESSIONS => {
  const chooseResponse = (e, next) => {
    // const session = SESSIONS.get(e.user.id)
     // ...for feedback ask question and set session.on.* if sth is unclear...
     if (/login/i.test(e.text)) {
       e.response = fmtFAQ.login()
     } else if (!Object.keys(e.response).length &&
                /reset|change/i.test(e.text) &&
                /password/i.test(e.text)) {
       e.response = fmtFAQ.resetPassword()
     } else if (!Object.keys(e.response).length &&
                /how\s.*(bizview|this\s+platform)\s.*works?/i.test(e.text)) {
       e.response = fmtFAQ.howItWorks()
     } else if (!Object.keys(e.response).length &&
                /accurate|accuracy|precise|precision/i.test(e.text) &&
                /data|info/i.test(e.text)) {
       e.response = fmtFAQ.infoAccuracy()
     } else if (!Object.keys(e.response).length &&
                /secure|security/i.test(e.text) &&
                /data|info/i.test(e.text)) {
       e.response = fmtFAQ.dataSecurity()
     } else if (!Object.keys(e.response).length &&
                Object.keys(e.stash.nameToCode).length) {
      const key = Object.keys(e.stash.nameToCode)[0] // always has length 1
      e.response = fmtGeneric.nameToCode(key, e.stash.nameToCode[key])
    } else if (!Object.keys(e.response).length &&
               Object.keys(e.stash.codeToName).length) {
      const key = Object.keys(e.stash.codeToName)[0] // always has length 1
      e.response = fmtGeneric.codeToName(key, e.stash.codeToName[key])
    } else if (!Object.keys(e.response).length) {
      e.response = fmtGeneric.fallback()
    }
    // SESSIONS.set(e.user.id, session) // y does this seem not to be obligatory?
    next(null, e)
    return e // 4 dev tests only
  }
   // returning a closure
  return chooseResponse
}
