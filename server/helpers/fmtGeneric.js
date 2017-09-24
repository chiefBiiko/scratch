'use strict'

const randomArrPick = require('./randomArrPick')

module.exports = Object.freeze({
  // generic content
  welcome: name => {
    return {
      text: `${randomArrPick([ 'Hi', 'Hello' ])} ${name || ''}\n` +
        `I can provide you with insights about your...`,
      buttons: [
        { text: 'Inventory', value: 'inventory'},
        { text: 'Volumes', value: 'volumes' },
        { text: 'Invoices', value: 'invoices' }
      ]
    }
  },
  welcomeAgain: name => {
    return {
      text: `Hey we have already met ${name || ''}`
    }
  },
  nice2Meet: name => {
    return {
      text: `Nice to meet you ${name || ''}`
    }
  },
  fallback: () => {
    return {
      text: randomArrPick(['Sorry, I did not understand that',
                           'Hm, not sure what you mean'])
    }
  },
  humanSupport: () => {
    return {
      text: 'You sound angry. Call 419 for human support via phone'
    }
  },
  bye: () => {
    return {
      text: randomArrPick(['Bye. It was nice talking to you ', 'See you'])
    }
  },
  // country code content
  nameToCode: (name, code) => {
    return {
      text: `${name} has code ${code}`
    }
  },
  codeToName: (code, name) => {
    return {
      text: `${code} stands for ${name}`
    }
  }
})
