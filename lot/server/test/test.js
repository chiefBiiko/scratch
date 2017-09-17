'use strict'

const chai = require('chai')
const should = chai.should()

const path = require('path')

const randomArrPick = require('./../helpers/randomArrPick')
const fmtContent = require('./../helpers/fmtContent.js')
const andFmtArr = require('./../helpers/andFmtArr')
const toTitleCase = require('./../helpers/toTitleCase')
const checkForUserName = require('./../helpers/checkForUserName')
const replaceOrFalsy = require('./../helpers/replaceOrFalsy')
const matchExAx = require('./../helpers/matchExAx')
const makeActiveMap = require('./../helpers/makeActiveMap')
const makeCCDB = require('./../helpers/makeCCDB')

const makeCheckYes = require('./../chain/makeCheckYes')
const makeManageSessions = require('./../chain/makeManageSessions')
const tokenizeText = require('./../chain/tokenizeText')
const rageScorer = require('./../chain/rageScorer')
const _makeCheckAgainstDB = require('./../chain/_makeCheckAgainstDB')
const _flag = require('./../chain/_flag')
const _patchProductInfo = require('./../chain/_patchProductInfo')
const _makeChooseResponse = require('./../chain/_makeChooseResponse')

describe('helpers', () => {
  describe('randomArrPick', () => {
    it('should quasi-randomly pick an item from an array', () => {
      const arr = ['a', 'b', 'c']
      arr.should.include(randomArrPick(arr))
    })
  })
  describe('fmtContent', () => {
    it('should be an object', () => {
      fmtContent.should.be.an('object')
    })
    it('should be an object with a bunch methods', () => {
      Object.keys(fmtContent).forEach(key => {
        fmtContent[key].should.be.a('function')
      })
      // fmtContent.welcome.should.be.a('function')
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
  describe('replaceOrFalsy', () => {
    it('should return a string in case of a replacement', () => {
      replaceOrFalsy('abc', /[ci]/, 'z').should.equal('abz')
    })
    it('should return an empty string in case of no replacement', () => {
      replaceOrFalsy('abc', 'y', 'z').should.equal('')
    })
  })
  describe('matchExAx', () => {
    const x = matchExAx('buy me an ipad pro',
                        ['buy', 'me', 'an', 'ipad', 'pro'],
                        ['iphone 7', 'ipad pro'])
    it('should return an array', () => {
      x.should.be.an('array')
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
  describe('makeCCDB', () => {
    it('should return an object', () => {
      makeCCDB(path.join(__dirname, '..', 'data', 'dev', 'cc.json'))
        .should.be.an('object')
    })
  })
})

describe('chain', () => {
  describe('makeManageSessions', () => {
    const ws = { send: () => {} } // dependency
    const SESSIONS = makeActiveMap(1) // dependency
    const manageSessions = makeManageSessions(ws, SESSIONS)
    it('should return a function', () => {
      manageSessions.should.be.a('function')
    })
    it('should return a function that manages SESSIONS\'s members', () => {
      manageSessions({ text: 'Hi Ho', user: { id: 'xyz' } }, () => {})
      const session = SESSIONS.get('xyz')
      session.should.be.an('object')
      session.should.have.all.keys('ws', 'name', 'last_query',
                                   'last_stamp', 'onyes')
    })
  })
  describe('makeCheckYes', () => {
    const SESSIONS = makeActiveMap(1)
    const checkYes = makeCheckYes(SESSIONS)
    it('should return a function', () => {
      checkYes.should.be.a('function')
    })
    it('should factor a function that resets e.text when asserting', () => {
      SESSIONS.set('xyz', {
        ws: { send: a => {} },
        last_stamp: 1504786753609, // .last_stamp must be a timestamp
        onyes: 'prepared response'
      })
      checkYes({ text: 'yes', user: { id: 'xyz' } }, () => {})
      SESSIONS.get('xyz').onyes.should.be.empty
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
  })
  describe('_makeCheckAgainstDB', () => {
    const _checkAgainstDB = _makeCheckAgainstDB('../data/dev/products.json', 10)
    const e = _checkAgainstDB({
      text: 'price of the iphone 7',
      tokens: [ 'price', 'of', 'the', 'iphone', '7' ]
    }, () => {})
    it('should return a function', () => {
      _checkAgainstDB.should.be.a('function')
    })
    it('should factor a function that sets a object under e.stash', () => {
      e.stash.should.be.an('object')
    })
    it('should set a set of data properties on e.stash', () => {
      e.stash.should.have.all.keys('exactProducts', 'approxProducts',
                                   'exactCategories', 'approxCategories',
                                   'hitProducts')
    })
  })
  describe('_flag', () => {
    const e = _flag({
      text: 'tell me the price of the iphone 7',
      stash: {
        exactProducts: [ 'iphone 7' ],
        hitProducts: {
          'iphone 7' : {
            category: 'smartphones',
            features: [ 'hd-camera', 'siri' ],
            pictures: [ 'iphront.png', 'iphback.png' ],
            price: 900,
            ratings: [ 4, 3, 5, 4, 3, 4, 3, 4, 1, 3 ],
          }
        }
      }
    },
    () => {})
    it('should set boolean flags as e.stash.hitProducts.*.flags.wants*', () => {
      e.stash.hitProducts['iphone 7'].flags.should.be.an('object')
      Object.keys(e.stash.hitProducts['iphone 7'].flags).forEach(_flag => {
        e.stash.hitProducts['iphone 7'].flags[_flag].should.be.a('boolean')
      })
    })
  })
  describe('_patchProductInfo', () => {
    const e = _patchProductInfo({
      text: 'tell me the price of the iphone 7',
      stash: {
        exactProducts: [ 'iphone 7' ],
        hitProducts: {
          'iphone 7' : {
            category: 'smartphones',
            features: [ 'hd-camera', 'siri' ],
            pictures: [ 'iphront.png', 'iphback.png' ],
            price: 900,
            ratings: [ 4, 3, 5, 4, 3, 4, 3, 4, 1, 3 ],
            flags: {
               features: false,
               pictures: false,
               price: true,
               ratings: false,
               wantsMinRating: false,
               wantsMaxRating: false,
               wantsAvgRating: false
            }
          }
        }
      }
    },
    () => {})
    it('should add a string under e.stash.hitProducts.*.patch', () => {
      e.stash.hitProducts['iphone 7'].patch.should.be.a('string')
    })
  })
  describe('_makeChooseResponse', () => {
    const SESSIONS = makeActiveMap(1) // dependency
    const _chooseResponse = _makeChooseResponse(SESSIONS)
    it('should return a function', () => {
      _chooseResponse.should.be.a('function')
    })
    it('should set session.onyes if there is an approx match', () => {
      SESSIONS.set('xyz', {
        ws: { send: a => {} }, // must be implemented
        last_stamp: 1504786753609, // .last_stamp must be a timestamp
        onyes: ''
      })
      _chooseResponse({
        text: 'features galaxy',
        user: { id: 'xyz' },
        stash: {
          exactProducts: [],
          approxProducts: { galaxy: 'Galaxy S9' },
          exactCategories: [],
          approxCategories: {},
          hitProducts: {
            'Galaxy S9': {
              category: 'smartphones',
              manufacturer: 'Samsung',
              features: [ 'durable', 'sustainable' ],
              pictures: [ 'front.png', 'back.png' ],
              price: 500,
              ratings: [ 2, 3, 5, 4, 2, 4, 3, 4, 1, 5 ],
              patch: 'The Galaxy S9 has cool features - alarm, and flashlight'
            }
          },
        }
      }, () => {})
      SESSIONS.get('xyz').onyes
        .endsWith('The Galaxy S9 has cool features - alarm, and flashlight')
        .should.be.true
    })
  })
})
