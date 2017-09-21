'use strict'

const fs = require('fs')
const https = require('https')
const path = require('path')
const WebSocket = require('ws')
const chain = require('run-waterfall')

// some small helpers
const makeActiveMap = require('./helpers/makeActiveMap')
const makeCCDB = require('./helpers/makeCCDB')
const parsePort = require('./helpers/parsePort')

// server setup
const host = process.argv[3] || '127.0.0.1'
const port = parsePort(process.argv[4]) || 50000
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
const makeCheckOn = require('./chain/makeCheckOn')
const makeCheckAgainstCCDB = require('./chain/makeCheckAgainstCCDB')
const makeChooseResponse = require('./chain/makeChooseResponse')

// app-specific globals
const SESSIONS = makeActiveMap(10)
var CCDB = makeCCDB(path.join(__dirname, 'data', 'ISO_3166-1_alpha-3.json'))

// chain functions
const manageSessions = makeManageSessions(SESSIONS)
const checkOn = makeCheckOn(SESSIONS)
const rageScorer = require('./chain/rageScorer')
const tokenizeText = require('./chain/tokenizeText')
const checkAgainstCCDB = makeCheckAgainstCCDB(CCDB)
const chooseResponse = makeChooseResponse(SESSIONS)
const devlog = require('./chain/devlog')

// websocketclient handlers
function wsMsgHandler (manageSessions,
                       checkOn,
                       checkAgainstCCDB,
                       chooseResponse, // binding all the above in wssConHandler
                       pack) {
  var callbackcount = 0
  const e = JSON.parse(pack) // e has .text already, and perhaps .on
  e.user = { id: this.id }
  e.tokens = []
  e.stash = {}
  e.response = {}
  if (!e.hasOwnProperty('on')) e.on = '' // TODO make sure e.on is a string if existing
  chain([
    next => next(null, e),
    manageSessions,
    checkOn,
    rageScorer,
    tokenizeText,
    checkAgainstCCDB, // _flag, _patchProductInfo,
    chooseResponse,
    devlog
  ], (err, e) => {
    if (err) return console.error(err)
    if (++callbackcount > 1) return
    this.send(JSON.stringify({ // this === ws
      response: e.response,
      interactive: e.interactive
    }))
  })
}
function wsCloseHandler () {
  console.log(`[closed connection: ${this.id}]`) // this === ws
}
const wsErrHandler = err => console.error(`[websocket error: ${err}]`)

// websocketserver handlers
function wssConHandler (ws/*, httpreq */) {
  ws.id = Math.random().toString()
  ws.on('message', wsMsgHandler.bind(ws, // passing ws as thisArg
                                     manageSessions,
                                     checkOn,
                                     checkAgainstCCDB,
                                     chooseResponse))
  ws.on('close', wsCloseHandler)
  ws.on('error', wsErrHandler)
  console.log(`[new connection: ${ws.id}]`)
}
const wssInitHandler = () => console.log(`[wsserver listening on port ${port}]`)
const wssErrHandler = err => console.error(`[wsserver error: ${err}]`)

wsserver.on('connection', wssConHandler)
wsserver.on('listening', wssInitHandler)
wsserver.on('error', wssErrHandler)
