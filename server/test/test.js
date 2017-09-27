'use strict'

const chai = require('chai')
const should = chai.should()

const path = require('path')

const isString = require('./../helpers/isString')
const parsePortOrNull = require('./../helpers/parsePortOrNull')
const randomArrPick = require('./../helpers/randomArrPick')
const fmtGeneric = require('./../helpers/fmtGeneric.js')
const fmtFAQ = require('./../helpers/fmtFAQ')
const andFmtArr = require('./../helpers/andFmtArr')
const toTitleCase = require('./../helpers/toTitleCase')
const checkForUserName = require('./../helpers/checkForUserName')
const replaceOrFalsey = require('./../helpers/replaceOrFalsey')
const matchExAx = require('./../helpers/matchExAx')
const makeActiveMap = require('./../helpers/makeActiveMap')
const makeBusinessRelationshipManagerDB =
  require('./../helpers/makeBusinessRelationshipManagerDB')
const makeCountryCodeDB = require('./../helpers/makeCountryCodeDB')

const makeManageSessions = require('./../chain/makeManageSessions')
const makeCheckOnTriggers = require('./../chain/makeCheckOnTriggers')
const makeCheckAgainstBusinessRelationshipManagerDB =
  require('./../chain/makeCheckAgainstBusinessRelationshipManagerDB')
const rageScorer = require('./../chain/rageScorer')
const tokenizeText = require('./../chain/tokenizeText')
const makeCheckAgainstCountryCodeDB =
  require('./../chain/makeCheckAgainstCountryCodeDB')
// const _flag = require('./../chain/_flag')
// const _patchProductInfo = require('./../chain/_patchProductInfo')
const makeChooseResponse = require('./../chain/makeChooseResponse')

describe('helpers', () => {

  describe('isString', () => {
    it('should detect all possible forms of strings', () => {
      isString('').should.be.true
      isString(`dir:${__dirname}`).should.be.true
      isString(JSON.stringify([4,1,9])).should.be.true
      isString('ordinary string').should.be.true
      isString(new String()).should.be.true
      isString(new String('wrapped string')).should.be.true
    })

  })

  describe('parsePortOrNull', () => {
    it('should parse a string sequence of digits to a number', () => {
      parsePortOrNull('12345').should.equal(12345)
    })
    it('should return null if the string contains anything but digits', () => {
      should.equal(parsePortOrNull('123noise'), null)
    })
    it('should return null if argument is falsey', () => {
      should.equal(parsePortOrNull(false), null)
      should.equal(parsePortOrNull(''), null)
      should.equal(parsePortOrNull(null), null)
      should.equal(parsePortOrNull(undefined), null)
    })
  })

  describe('randomArrPick', () => {
    it('should quasi-randomly pick an item from an array', () => {
      const arr = ['a', 'b', 'c']
      arr.should.include(randomArrPick(arr))
    })
  })

  describe('fmtGeneric', () => {
    it('should be an object', () => {
      fmtGeneric.should.be.an('object')
    })
    it('should be an object with a bunch methods', () => {
      Object.keys(fmtGeneric).forEach(key => {
        fmtGeneric[key].should.be.a('function')
      })
    })
    it('should be an object with a bunch methods that return objects', () => {
      fmtGeneric.welcome().should.be.an('object')
    })
  })

  describe('fmtFAQ', () => {
    it('should be an object', () => {
      fmtFAQ.should.be.an('object')
    })
    it('should be an object with a bunch of methods', () => {
      Object.keys(fmtFAQ).forEach(key => {
        fmtFAQ[key].should.be.a('function')
      })
    })
    it('should be an object with a bunch methods that return objects', () => {
      fmtFAQ.login().should.be.an('object')
    })
    it('should have methods that return a e.interactives aside e.text', () => {
       fmtFAQ.login().quickCopies.should.be.an('array')
    })
  })

  describe('andFmtArr', () => {
    it('should return a string', () => {
      andFmtArr(['pizza', 'pasta', 'burgers']).should.be.a('string')
    })
    it('should format an array to a semantic sequence', () => {
      andFmtArr(['a', 'b', 'c']).should.equal('a, b, and c')
    })
    it('should handle empty and length-one arrays', () => {
      andFmtArr([]).should.equal('')
      andFmtArr([1]).should.equal('1')
    })
  })

  describe('toTitleCase', () => {
    it('should uppercase the first letter of a string', () => {
      toTitleCase('chief').should.equal('Chief')
    })
    it('should handle the jim-bob -> Jim-Bob problem', () => {
      toTitleCase('jim-bob').should.equal('Jim-Bob')
    })
    it('should allow empty strings', () => {
      toTitleCase('').should.equal('')
    })
  })

  describe('checkForUserName', () => {
    it('should extract a name from a "my name is..." statement', () => {
      checkForUserName('wahala my name is kweku mensa').should.equal('Kweku')
    })
    it('should return an empty string if no name detected', () => {
      checkForUserName('my number one food is pizza').should.equal('')
    })
  })

  describe('replaceOrFalsey', () => {
    it('should return a string in case of a replacement', () => {
      replaceOrFalsey('abc', /[ci]/, 'z').should.equal('abz')
    })
    it('should return an empty string in case of no replacement', () => {
      replaceOrFalsey('abc', 'y', 'z').should.equal('')
    })
  })

  describe('matchExAx', () => {
    const x = matchExAx('buy me an ipad pro',
                        ['buy', 'me', 'an', 'ipad', 'pro'],
                        ['iphone 7', 'ipad pro'])
    it('should return an array', () => {
      x.should.be.an('array')
    })
    it('should return an array of strings', () => {
      x.forEach(item => item.should.be.a('string'))
    })
  })

  describe('makeActiveMap', () => {
    it('should return an ~auto-flush map', done => {
      const SESSIONS = makeActiveMap(1)
      SESSIONS.set('testsession', { last_stamp: 1504786753609 })
      setTimeout(() => {
        SESSIONS.should.be.empty
        done()
      }, 1000 * 61)       // exec timeout
    }).timeout(1000 * 63) // test timeout
  })

  describe('makeBusinessRelationshipManagerDB', () => {
    const BusinessRelationshipManagerDB = makeBusinessRelationshipManagerDB(
      path.join(__dirname, '..', 'data', 'BRM.json')
    )
    it('should return an object', () => {
      BusinessRelationshipManagerDB.should.be.an('object')
    })
    it('should return an object with string properties', () => {
      for (const key in BusinessRelationshipManagerDB) {
        if (BusinessRelationshipManagerDB.hasOwnProperty(key)) {
          BusinessRelationshipManagerDB[key].should.be.a('string')
        }
      }
    })
  })

  describe('makeCountryCodeDB', () => {
    it('should return an object', () => {
      makeCountryCodeDB(path.join(__dirname,
                                  '..',
                                  'data',
                                  'ISO_3166-1_alpha-3.json'))
        .should.be.an('object')
    })
    it('should return an object with .nameToCode and .codeToName', () => {
      makeCountryCodeDB(path.join(__dirname,
                                  '..',
                                  'data',
                                  'ISO_3166-1_alpha-3.json'))
        .should.have.all.keys('nameToCode', 'codeToName')
    })
  })

})

describe('chain', () => {

  describe('makeManageSessions', () => {
    const SESSIONS = makeActiveMap(1) // dependency
    const manageSessions = makeManageSessions(SESSIONS)
    it('should return a function', () => {
      manageSessions.should.be.a('function')
    })
    it('should return a function that manages SESSIONS\'s members', () => {
      manageSessions({ text: 'Hi Ho', user: { id: 'xyz' } }, () => {})
      const session = SESSIONS.get('xyz')
      session.should.be.an('object')
      session.should.have.all.keys('name', 'last_query', 'last_stamp', 'on')
    })
  })

  describe('makeCheckOnTriggers', () => {
    const SESSIONS = makeActiveMap(1)
    const checkOnTriggers = makeCheckOnTriggers(SESSIONS)
    it('should return a function', () => {
      checkOnTriggers.should.be.a('function')
    })
    it('should factor a function that sets e.response on hit', () => {
      SESSIONS.set('xyz', {
        last_stamp: 1504786753609, // .last_stamp must be a timestamp
        on: { yes: { text: 'prepared response' } }
      })
      const checkedOn = checkOnTriggers({
        text: 'yes',
        response: {},
        user: { id: 'xyz' },
        on: 'yes'
      }, () => {})
      checkedOn.response.should.not.be.empty
      checkedOn.response.text.should.equal('prepared response')
    })
  })

  describe('makeCheckAgainstBusinessRelationshipManagerDB', () => {
    const BusinessRelationshipManagerDB = makeBusinessRelationshipManagerDB(
      path.join(__dirname, '..', 'data', 'BRM.json') // dependency
    )
    const checkAgainstBusinessRelationshipManagerDB =
      makeCheckAgainstBusinessRelationshipManagerDB(
        BusinessRelationshipManagerDB
      )
    it('should return a function', () => {
      checkAgainstBusinessRelationshipManagerDB.should.be.a('function')
    })
    it('should return a function that can provide BRM name', () => {
      const e = checkAgainstBusinessRelationshipManagerDB({
        sid: '419',
        text: 'who is my contact?',
        response: {}
      }, () => {})
      e.response.text.startsWith('Your business relationship manager is')
        .should.be.true
    })
  })

  describe('tokenizeText', () => {
    const e = tokenizeText({ text: 'Hi Ho' }, () => {})
    it('should return an object (e)', () => {
      e.should.be.an('object')
    })
    it('should return e with an array for .tokens', () => {
      e.tokens.should.be.an('array')
    })
  })

  describe('rageScorer', () => {
    it('should return a function', () => {
      rageScorer.should.be.a('function')
    })
    it('should set e.response if sentiment is negative', () => {
      rageScorer({ text: 'you are dumb', response: {} }, () => {})
        .response.text.startsWith('You sound angry').should.be.true
    })
  })

  describe('makeCheckAgainstCountryCodeDB', () => {
    const checkAgainstCountryCodeDB = makeCheckAgainstCountryCodeDB({
      nameToCode: { Germany: 'DEU' },
      codeToName: {}
    })
    const e = checkAgainstCountryCodeDB({
      text: 'country code Germany',
      tokens: [ 'country', 'code', 'Germany' ],
      response: {}
    }, () => {})
    it('should return a function', () => {
      checkAgainstCountryCodeDB.should.be.a('function')
    })
    it('should factor a function that sets a object under e.stash', () => {
      e.stash.should.be.an('object')
    })
    it('should set .nameToCode and .codeToName on e.stash', () => {
      e.stash.should.have.all.keys('nameToCode', 'codeToName')
    })
    it('should put objects on e.stash.*To*', () => {
      e.stash.nameToCode.should.be.an('object')
      e.stash.codeToName.should.be.an('object')
    })
  })

  // describe('_flag', () => {
  //   const e = _flag({
  //     text: 'tell me the price of the iphone 7',
  //     stash: {
  //       exactProducts: [ 'iphone 7' ],
  //       hitProducts: {
  //         'iphone 7': {
  //           category: 'smartphones',
  //           features: [ 'hd-camera', 'siri' ],
  //           pictures: [ 'iphront.png', 'iphback.png' ],
  //           price: 900,
  //           ratings: [ 4, 3, 5, 4, 3, 4, 3, 4, 1, 3 ]
  //         }
  //       }
  //     }
  //   },
  //   () => {})
  //   it('should set boolean flags as e.stash.hitProducts.*.flags.wants*', () => {
  //     e.stash.hitProducts['iphone 7'].flags.should.be.an('object')
  //     Object.keys(e.stash.hitProducts['iphone 7'].flags).forEach(_flag => {
  //       e.stash.hitProducts['iphone 7'].flags[_flag].should.be.a('boolean')
  //     })
  //   })
  // })
  //
  // describe('_patchProductInfo', () => {
  //   const e = _patchProductInfo({
  //     text: 'tell me the price of the iphone 7',
  //     stash: {
  //       exactProducts: [ 'iphone 7' ],
  //       hitProducts: {
  //         'iphone 7': {
  //           category: 'smartphones',
  //           features: [ 'hd-camera', 'siri' ],
  //           pictures: [ 'iphront.png', 'iphback.png' ],
  //           price: 900,
  //           ratings: [ 4, 3, 5, 4, 3, 4, 3, 4, 1, 3 ],
  //           flags: {
  //             features: false,
  //             pictures: false,
  //             price: true,
  //             ratings: false,
  //             wantsMinRating: false,
  //             wantsMaxRating: false,
  //             wantsAvgRating: false
  //           }
  //         }
  //       }
  //     }
  //   },
  //   () => {})
  //   it('should add a string under e.stash.hitProducts.*.patch', () => {
  //     e.stash.hitProducts['iphone 7'].patch.should.be.a('string')
  //   })
  // })

  describe('makeChooseResponse', () => {
    const SESSIONS = makeActiveMap(1) // dependency
    const chooseResponse = makeChooseResponse(SESSIONS)
    const choice = chooseResponse({
      text: 'Let me reset my password',
      response: '',
      interactive: {},
      user: { id: 'xyz' },
      stash: { nameToCode: {}, codeToName: {} }
    }, () => {})
    it('should return a function', () => {
      chooseResponse.should.be.a('function')
    })
    it('should return a function that sets a response object on e', () => {
      choice.response.should.be.an('object')
    })
    it('should detect FAQ, fx password related', () => {
      choice.response.text.should.include('password')
    })
    it('should return an array of objects on e.interactive.links, fx', () => {
      choice.response.links.should.be.an('array')
      choice.response.links[0].should.have.all.keys('href', 'text')
    })
  })

})
