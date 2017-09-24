'use strict'

const fs = require('fs')
const https = require('https')
const path = require('path')
const WebSocket = require('ws')
const chain = require('run-waterfall')

// some small helpers
const isString = require('./helpers/isString')
const makeActiveMap = require('./helpers/makeActiveMap')
const makeCountryCodeDB = require('./helpers/makeCountryCodeDB')
const parsePortOrNull = require('./helpers/parsePortOrNull')

// server setup
const host = process.argv[3] || '127.0.0.1'
const port = parsePortOrNull(process.argv[4]) || 50000
const httpsserver = https.createServer({
  key: fs.readFileSync('./tls/key.pem'), // need 2 have these signed 4 wss
  cert: fs.readFileSync('./tls/cert.pem')
})
const wsserver = new WebSocket.Server({
  host: host,
  port: port,
  server: httpsserver
})

// chain function factories
const makeManageSessions = require('./chain/makeManageSessions')
const makeCheckOnTriggers = require('./chain/makeCheckOnTriggers')
const makeCheckAgainstCountryCodeDB =
  require('./chain/makeCheckAgainstCountryCodeDB')
const makeChooseResponse = require('./chain/makeChooseResponse')

// app-specific globals
const SESSIONS = makeActiveMap(10)
var CountryCodeDB = makeCountryCodeDB(path.join(__dirname,
                                                'data',
                                                'ISO_3166-1_alpha-3.json'))

// chain functions
const manageSessions = makeManageSessions(SESSIONS)
const checkOnTriggers = makeCheckOnTriggers(SESSIONS)
const rageScorer = require('./chain/rageScorer')
const tokenizeText = require('./chain/tokenizeText')
const checkAgainstCountryCodeDB =
  makeCheckAgainstCountryCodeDB(CountryCodeDB)
const chooseResponse = makeChooseResponse(SESSIONS)
const devlog = require('./chain/devlog')

// websocketclient handlers
function websocketMessageHandler(manageSessions,
                                 checkOnTriggers,
                                 checkAgainstCountryCodeDB,
                                 chooseResponse,
                                 pack) {
  var callbackcount = 0
  const e = JSON.parse(pack) // e has .text already, and might have .on
  e.user     = { id: this.id }
  e.tokens   = []
  e.stash    = {}
  e.response = {}
  if (!e.hasOwnProperty('on') || !isString(e.on)) e.on = '' // TODO make sure e.on is a string if existing
  chain([
    next => next(null, e),
    manageSessions,
    checkOnTriggers,
    rageScorer,
    tokenizeText,
    checkAgainstCountryCodeDB, // _flag, _patchProductInfo,
    chooseResponse,
    devlog
  ], (err, e) => {
    if (err) return console.error(err)
    if (++callbackcount > 1) return
    this.send(JSON.stringify({ // this === websocket
      response: e.response,
      interactive: e.interactive
    }))
  })
}
function websocketCloseHandler() {
  console.log(`[closed connection: ${this.id}]`) // this === websocket
}
const websocketErrorHandler = err => {
  console.error(`[websocket error: ${err}]`)
}

// websocketserver handlers
function wssConnectionHandler (manageSessions, checkOnTriggers,
                               checkAgainstCountryCodeDB, chooseResponse,
                               websocket/*, httpreq */) {
  websocket.id = Math.random().toString()
  websocket.on('message', websocketMessageHandler.bind(websocket, // thisArg
    manageSessions, checkOnTriggers, checkAgainstCountryCodeDB, chooseResponse)) // chain funcs
  websocket.on('close', websocketCloseHandler)
  websocket.on('error', websocketErrorHandler)
  console.log(`[new connection: ${websocket.id}]`)
}
const wssInitHandler = (port => {
  console.log(`[wsserver listening on port ${port}]`)
}).bind(null, port)
const wssErrorHandler = err => console.error(`[wsserver error: ${err}]`)

// registering websocketserver handlers
wsserver.on('connection', wssConnectionHandler.bind(wsserver, // thisArg
  manageSessions, checkOnTriggers, checkAgainstCountryCodeDB, chooseResponse))
wsserver.on('listening', wssInitHandler)
wsserver.on('error', wssErrorHandler)
