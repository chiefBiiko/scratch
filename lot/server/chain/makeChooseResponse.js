'use strict'

const fmtGeneric = require('./../helpers/fmtGeneric')
const fmtFAQ = require('./../helpers/fmtFAQ')

module.exports = SESSIONS => {
  const chooseResponse = (e, next) => {
    if (e.response)  next(null, e)
    // const session = SESSIONS.get(e.user.id)
     // ...ask question and set session.onyes IF anything is approx or unclear
     if (/login/i.test(e.text)) {
       const login = fmtFAQ.login()
       e.response = login.text
       e.interactive.quickCopies = login.quickCopies
     } else if (!e.response &&
                /reset|change/i.test(e.text) &&
                /password/i.test(e.text)) {
       const resetPassword = fmtFAQ.resetPassword()
       e.response = resetPassword.text
       e.interactive.links = resetPassword.links
     } else if (!e.response &&
                /how\s.*(bizview|this\s+platform)\s.*works?/i.test(e.text)) {
       e.response = fmtFAQ.howItWorks().text
     } else if (!e.response &&
                /accurate|accuracy|precise|precision/i.test(e.text) &&
                /data|info/i.test(e.text)) {
       e.response = fmtFAQ.infoAccuracy().text
     } else if (!e.response &&
                /secure|security/i.test(e.text) &&
                /data|info/i.test(e.text)) {
       const dataSecurity = fmtFAQ.dataSecurity()
       e.response = dataSecurity.text
       e.interactive.links = dataSecurity.links
     } else if (!e.response &&
                Object.keys(e.stash.nameToCode).length) {
      const key = Object.keys(e.stash.nameToCode)[0]
      e.response = fmtGeneric.nameToCode(key, e.stash.nameToCode[key]).text
    } else if (!e.response &&
               Object.keys(e.stash.codeToName).length) {
      const key = Object.keys(e.stash.codeToName)[0]
      e.response = fmtGeneric.codeToName(key, e.stash.codeToName[key]).text
    } else if (!e.response) {
      e.response = fmtGeneric.fallback().text
    }
    // SESSIONS.set(e.user.id, session) // y does this seem not to be obligatory?
    next(null, e)
    return e // 4 dev tests only
  }
   // returning a closure
  return chooseResponse
}
