'use strict'

module.exports = SESSIONS => {
  const checkYes = (e, next) => {
    if (e.response)  next(null, e)
    const session = SESSIONS.get(e.user.id)
    if (session.onyes && /^\s*(yes|yea|ya|y)\s*$/i.test(e.text)) {
      e.response = session.onyes
    }
    session.onyes = ''
    SESSIONS.set(e.user.id, session)
    next(null, e)
    return e // 4 dev tests only
  }
  // returning a closure
  return checkYes
}
