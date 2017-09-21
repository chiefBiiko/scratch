'use strict'

const checkForUserName = require('./../helpers/checkForUserName')
const fmtGeneric = require('./../helpers/fmtGeneric')

module.exports = SESSIONS => {
  const manageSessions = (e, next) => { // closes over ESSIONS
    const name = checkForUserName(e.text)
    if (!SESSIONS.has(e.user.id)) { // new session
      const welcome = fmtGeneric.welcome(name)
      e.response = welcome.text
      e.interactive = welcome.buttons
      SESSIONS.set(e.user.id, { // ...and store it
        name: name,
        last_query: e.text,
        last_stamp: new Date().getTime(),
        onyes: '' // on: {} // 
      })
    } else { // existing session
      const session = SESSIONS.get(e.user.id)
      session.last_query = e.text,
      session.last_stamp = new Date().getTime()
      if (!session.name && name) {
        session.name = name
        e.response = fmtGeneric.nice2Meet(name).text
      }
      SESSIONS.set(e.user.id, session)
      if (!e.response && /^(hi|hallo|hello|hey)/i.test(e.text)) {
        e.response = fmtGeneric.welcomeAgain(session.name || name).text
      } else if (/bye|goodbye|see you|see ya|later/i.test(e.text)) {
        e.response = fmtGeneric.bye(name).text
      }
    }
    next(null, e)
    return e // 4 dev tests only
  }
  // returning a closure
  return manageSessions
}
