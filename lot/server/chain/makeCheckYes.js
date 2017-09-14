'use strict'

module.exports = SESSIONS => {
  const checkYes = (e, next) => {
    const session = SESSIONS.get(e.user.id)
    // REFACTOR TO SEND RESPONSE IMMEDIATELY
    if (session.onyes && /^\s*(yes|yea|ya|y)\s*$/i.test(e.text)) {
      session.ws.send(JSON.stringify({ text: session.onyes }))
    }
    session.onyes = ''
    SESSIONS.set(e.user.id, session)
    next(null, e)
    return e // 4 dev tests only, ignored by botpress
  }
  // returning a closure
  return checkYes
}
