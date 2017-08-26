const url = require('url')
const WebSocketServer = require('ws').Server
const classifier = require('./nlp/load-classifier')('./nlp/classifier.json')

const host = process.argv[3] || '127.0.0.1'
const port = /^\d+$/.test(process.argv[4]) ? Number(process.argv[4]) : 50001
const wsserver = new WebSocketServer({ host: host, port: port })

// websocketclient handlers
const wsErrHandler = err => console.error(`[websocket error:\n${err}\n]`)
const wsCloseHandler = (/*code, reason*/) => console.log('[closed connection]')
function wsMsgHandler(pack) {  // this === ws
  const sack = JSON.parse(pack)
  const res = classifier.classify(sack.message)  // map incoming to response
  console.log(`[session ${sack.session} incoming: ${sack.message}]`)
  console.log(`[session ${sack.session} response: ${res}]`)
  this.send(JSON.stringify({ session: sack.session, message: res }))
}

// websocketserver handlers
const wssErrHandler = err => console.error(`[wsserver error:\n${err}\n]`)
const wssInitHandler = () => console.log(`[wsserver listening on port ${port}]`)
function wssConHandler(ws, httpreq) {
  console.log('[new connection]')
  ws.session = url.parse(httpreq.url, true).query.session
  ws.on('error', wsErrHandler)
  ws.on('close', wsCloseHandler)
  ws.on('message', wsMsgHandler)
}

wsserver.on('error', wssErrHandler)
wsserver.on('listening', wssInitHandler)
wsserver.on('connection', wssConHandler)
