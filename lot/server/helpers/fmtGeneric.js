'use strict'

const randomArrPick = require('./randomArrPick')

module.exports = {
  // generic content
  welcome: name => {
    return `${randomArrPick([ 'Hey', 'Hello' ])} ${name || ''}\n` +
      `I provide info on tech products, their features, prices, and ratings`
  },
  welcomeAgain: name => {
    return `Hey we have already met ${name || ''}`
  },
  nice2Meet: name => {
    return `Nice to meet you ${name || ''}`
  },
  fallback: () => {
    return randomArrPick(['Sorry, I did not understand that',
      'Hm, not sure what you mean'])
  },
  humanSupport: () => {
    return 'You sound angry. Call 419 for human support via phone'
  },
  bye: () => {
    return randomArrPick(['Bye. It was nice talking to you ', 'See you'])
  },
  // country code content
  nameToCode: (name, code) => {
    return `${name} has code ${code}`
  },
  codeToName: (code, name) => {
    return `${code} stands for ${name}`
  }
}
