'use strict'

const checkForUserName = require('./../helpers/checkForUserName')
const fmtContent = require('./../helpers/fmtContent')

module.exports = (ws, SESSIONS) => {
  const manageSessions = (e, next) => { // closes over ws and SESSIONS
    const name = checkForUserName(e.text)
    if (!SESSIONS.has(e.user.id)) { // new session
      ws.send(JSON.stringify({ text: fmtContent.welcome(name) }))
      SESSIONS.set(e.user.id, { // ...and store it
        ws: ws,
        name: name,
        last_query: e.text,
        last_stamp: new Date().getTime(),
        onyes: ''
      })
      return
    } else { // existing session
      const session = SESSIONS.get(e.user.id)
      session.last_query = e.text,
      session.last_stamp = new Date().getTime()
      if (!session.name && name) {
        session.name = name
        session.ws.send(JSON.stringify({
          text: fmtContent.nice2Meet(name)
        }))
        return
      }
      SESSIONS.set(e.user.id, session)
      if (/^(hi|hallo|hello|hey)/i.test(e.text)) {
        session.ws.send(JSON.stringify({
          text: fmtContent.welcomeAgain(session.name || name)
        }))
        return
      } else if (/bye|goodbye|see you|see ya|later/i.test(e.text)) {
        session.ws.send(JSON.stringify({ text: fmtContent.bye(name) }))
        return
      }
    }
    next(null, e)
    return e // 4 dev tests only, ignored by botpress
  }
  // returning a closure
  return manageSessions
}
