'use strict'

module.exports = SESSIONS => {
  const checkOnTriggers = (e, next) => {
    if (Object.keys(e.response).length) next(null, e)
    const session = SESSIONS.get(e.user.id)
    if (e.on.length) {
      Object.keys(session.on).forEach(key => {
        if (RegExp(key, 'i').test(e.on)) e.response = session.on[key]
      })
    }
    SESSIONS.set(e.user.id, session)
    next(null, e)
    return e // 4 dev tests only
  }
  // returning a closure
  return checkOnTriggers
}
