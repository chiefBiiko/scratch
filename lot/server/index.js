'use strict'

const path = require('path')
const WebSocket = require('ws')
const waterfall = require('run-waterfall')

const host = process.argv[3] || '127.0.0.1'
const port = /^\d+$/.test(process.argv[4]) ? Number(process.argv[4]) : 50000
const wsserver = new WebSocket.Server({ host: host, port: port })

const SESSIONS = require('./helpers/makeActiveMap')(10)

// helpers
const makeCCDB = require('./helpers/makeCCDB')

// chain
const makeManageSessions = require('./chain/makeManageSessions')
const makeCheckYes = require('./chain/makeCheckYes')
const makeRageScorer = require('./chain/makeRageScorer')
const tokenizeText = require('./chain/tokenizeText')
//const _makeCheckAgainstDB = require('./chain/_makeCheckAgainstDB')
const makeCheckAgainstCCDB = require('./chain/makeCheckAgainstCCDB')
const _flag = require('./chain/_flag')
//const _patchProductInfo = require('./chain/_patchProductInfo')
const _makeChooseResponse = require('./chain/_makeChooseResponse')
const devlog = require('./chain/devlog')

// global, auto-updated DB
var CC_DB = makeCCDB(path.join(__dirname, 'data', 'dev', 'cc.json'))

// websocketclient handlers
const wsErrHandler = err => console.error(`[websocket error: ${err}]`)
function wsCloseHandler() { // this === ws
  console.log(`[closed connection: ${this.id}]`)
}
function wsMsgHandler(e) {  // this === ws
  const pack = JSON.parse(e)
  pack.user = { id: this.id }
  pack.response = ''
  // waterfall thru
  waterfall([
    next => next(null, pack),
    makeManageSessions(this, SESSIONS),
    makeCheckYes(SESSIONS),
    makeRageScorer(SESSIONS),
    tokenizeText,
  //_makeCheckAgainstDB(),
    _flag,
  //_patchProductInfo,
    _makeChooseResponse(SESSIONS),
    devlog
  ], (err, e) => {
    if (err) return console.error(err)
    console.log('waterfallthru')
  })
  // const res = 'hi' // waterfall!!!
  // console.log(`[session ${pack.user.id} incoming: ${pack.text}]`)
  // console.log(`[session ${pack.user.id} response: ${res}]`)
  // this.send(JSON.stringify({ text: res }))
}

// websocketserver handlers
const wssErrHandler = err => console.error(`[wsserver error: ${err}]`)
const wssInitHandler = () => console.log(`[wsserver listening on port ${port}]`)
function wssConHandler(ws/*, httpreq*/) {
  console.log('[new connection]')
  ws.id = Math.random().toString()
  ws.on('error', wsErrHandler)
  ws.on('close', wsCloseHandler)
  ws.on('message', wsMsgHandler)
}

wsserver.on('error', wssErrHandler)
wsserver.on('listening', wssInitHandler)
wsserver.on('connection', wssConHandler)
