'use strict'

module.exports = (e, next) => {
  console.log(`e.user.id: ${e.user.id}\n` +
              `e.text: ${e.text}\n` +
              `e.tokens: ${JSON.stringify(e.tokens)}\n` +
              `e.stash: ${JSON.stringify(e.stash)}\n` +
              `e.response: ${e.response}`)
  next(null, e)
}
