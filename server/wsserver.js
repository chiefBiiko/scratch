const ChatBot = require('./bot/chatbot')
const path = require('path')
const WebSocket = require('ws')

const host = process.argv[3] || '127.0.0.1'
const port = /^\d+$/.test(process.argv[4]) ? Number(process.argv[4]) : 50001
const wsserver = new WebSocket.Server({ host: host, port: port })
var stepr = 0

// websocketclient handlers
const wsErrHandler = err => console.error(`[websocket error: ${err}]`)
const wsCloseHandler = (/*code, reason*/) => console.log('[closed connection]')
function wsMsgHandler(pack) {  // this === ws
  const sack = JSON.parse(pack)
  const res = this.chatbot.respond(sack.message)
  console.log(`[session ${sack.session} incoming: ${sack.message}]`)
  console.log(`[session ${sack.session} response: ${res}]`)
  this.send(JSON.stringify({ session: sack.session, message: res }))
}

// websocketserver handlers
const wssErrHandler = err => console.error(`[wsserver error: ${err}]`)
const wssInitHandler = () => console.log(`[wsserver listening on port ${port}]`)
function wssConHandler(ws/*, httpreq*/) {
  console.log('[new connection]')
  ws.chatbot = new ChatBot()
  ws.on('error', wsErrHandler)
  ws.on('close', wsCloseHandler)
  ws.on('message', wsMsgHandler)
}

wsserver.on('error', wssErrHandler)
wsserver.on('listening', wssInitHandler)
wsserver.on('connection', wssConHandler)
