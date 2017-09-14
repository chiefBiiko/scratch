'use strict'

//const replaceOrFalsy = require('./../helpers/replaceOrFalsy')
const fmtContent = require('./../helpers/fmtContent')

module.exports = SESSIONS => {
   const chooseResponse = (e, next) => {
     const session = SESSIONS.get(e.user.id)
     if (Object.keys(e.stash.hitProducts).length &&
         !Object.keys(e.stash.approxProducts).length) {
       Object.keys(e.stash.hitProducts).forEach(pname => {
         session.ws.send(
           JSON.stringify({
             text: fmtContent.hitProduct(e.stash.hitProducts[pname].patch)
           })
         )
       })
     } else if (Object.keys(e.stash.approxProducts).length) {
       const assertProductKey = Object.keys(e.stash.approxProducts)[0]
       const assertProductVal = e.stash.approxProducts[assertProductKey]
       session.ws.send(
         JSON.stringify({
           text: fmtContent.assertProduct(assertProductVal)
         })
       )
       session.onyes =
         fmtContent.hitProduct(e.stash.hitProducts[assertProductVal].patch)
     } else if (e.stash.exactCategories.length) {
       session.ws.send(
         JSON.stringify({
           text: fmtContent.hitCategory(e.stash.exactCategories[0])
         })
       )
     } else if (Object.keys(e.stash.approxCategories).length) {
       const assertCategoryKey = Object.keys(e.stash.approxCategories)[0]
       const assertCategoryVal = e.stash.approxCategories[assertCategoryKey]
       session.ws.send(
         JSON.stringify({
           text: fmtContent.assertCategory(assertCategoryVal)
         })
       )
       session.onyes = fmtContent.hitCategory(assertCategoryVal)
     } else {
       session.ws.send(JSON.stringify({
         text: fmtContent.fallback()
       }))
     }
     SESSIONS.set(e.user.id, session) // y does this seem not to be obligatory?
     next(null, e)
     return e // 4 dev tests only, ignored by botpress
   }
   // returning a closure
   return chooseResponse
}
