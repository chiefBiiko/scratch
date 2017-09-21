'use strict'

module.exports = (e, next) => {
  console.log(`[ ${new Date().toUTCString()}\n` +
              `e.user.id: ${e.user.id}\n` +
              `e.text: ${e.text}\n` +
              `e.on: ${e.on}\n` +
              `e.tokens: ${JSON.stringify(e.tokens)}\n` +
              `e.stash: ${JSON.stringify(e.stash)}\n` +
              `e.response: ${JSON.stringify(e.response)}\n]`)
  next(null, e)
}
