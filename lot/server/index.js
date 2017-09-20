'use strict'

const path = require('path')
const WebSocket = require('ws')
const chain = require('run-waterfall')

// some small helpers
const makeCCDB = require('./helpers/makeCCDB')
const parsePort = require('./helpers/parsePort')

// server setup
const host = process.argv[3] || '127.0.0.1'
const port = parsePort(process.argv[4]) || 50000
const wsserver = new WebSocket.Server({ host: host, port: port })

// chain function factories
const makeManageSessions = require('./chain/makeManageSessions')
const makeCheckYes = require('./chain/makeCheckYes')
const makeCheckAgainstCCDB = require('./chain/makeCheckAgainstCCDB')
const makeChooseResponse = require('./chain/makeChooseResponse')

// app-specific globals
const SESSIONS = require('./helpers/makeActiveMap')(10)
var CCDB = makeCCDB(path.join(__dirname, 'data', 'ISO_3166-1_alpha-3.json'))

// chain functions
const manageSessions = makeManageSessions(SESSIONS)
const checkYes = makeCheckYes(SESSIONS)
const rageScorer = require('./chain/rageScorer')
const tokenizeText = require('./chain/tokenizeText')
const checkAgainstCCDB = makeCheckAgainstCCDB(CCDB)
const chooseResponse = makeChooseResponse(SESSIONS)
const devlog = require('./chain/devlog')

// websocketclient handlers
function wsMsgHandler (manageSessions,
                       checkYes,
                       checkAgainstCCDB,
                       chooseResponse,
                       pack) {
  var callbackcount = 0
  const e = JSON.parse(pack)
  e.user = { id: this.id }
  e.response = ''
  e.interactive = {}
  chain([
    next => next(null, e),
    manageSessions,
    checkYes,
    rageScorer,
    tokenizeText,
    checkAgainstCCDB, // _flag, _patchProductInfo,
    chooseResponse,
    devlog
  ], (err, e) => {
    if (err) return console.error(err)
    if (++callbackcount > 1) return
    this.send(JSON.stringify({ // this === ws
      text: e.response,
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
  ws.on('message', wsMsgHandler.bind(ws,
                                     manageSessions,
                                     checkYes,
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
