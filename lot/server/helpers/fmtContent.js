'use strict'

const randomArrPick = require('./randomArrPick')

module.exports = {
  welcome: name => {
    return `${randomArrPick([ 'Hey', 'Hello' ])} ${name || ''}\n` +
      `I provide info on tech products, their features, prices, and ratings`
  },
  welcomeAgain: name => `Hey we have already met ${name || ''}`,
  nice2Meet: name => `Nice to meet you ${name || ''}`,
  hitProduct: patch => {
    return `${randomArrPick(['Bingo!', 'Here you go.', 'Ok.'])} ${patch}`
  },
  hitCategory: category => `Ok. What do you want to know about ${category}?`,
  assertProduct: product => {
    return `${randomArrPick(['Are you talking about the',
                             'Looking for the'])} ${product}?`
  },
  assertCategory: category => `Do you mean ${category}?`,
  fallback: () => randomArrPick(['Sorry, I did not understand that',
                                 'Hm, not sure what you mean']),
  humanSupport: () => 'You sound angry. Do you want human support via phone?',
  bye: name => randomArrPick([`Bye. It was nice talking to you ${name || ''}`,
                              'See you'])
}
