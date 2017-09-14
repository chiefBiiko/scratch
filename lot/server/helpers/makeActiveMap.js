'use strict'

module.exports = minutes => { // ~delete inactive users after minutes
  const SESSIONS = new Map()
  setInterval(() => {
    const now = new Date().getTime()
    SESSIONS.forEach((session, key) => {
      if ((now - session.last_stamp) > 1000 * 60 * minutes) {
        session = null
        SESSIONS.delete(key) // kill convo after x min inactivity
      }
    })
  }, 1000 * 60 * 1) // flush every minute
  // factory return: auto-flush map
  return SESSIONS
}
