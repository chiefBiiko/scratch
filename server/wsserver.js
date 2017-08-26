const url = require('url')
const WebSocketServer = require('ws').Server
const classifier = require('./nlp/load-classifier')('./nlp/classifier.json')
// require stream-set for connection/session management... TODO

const host = process.argv[3] || '127.0.0.1'
const port = /^\d+$/.test(process.argv[4]) ? Number(process.argv[4]) : 50001
const wsserver = new WebSocketServer({ host: host, port: port })

const wsServerErrHandler = err => console.error(`[wsserver error:\n${err}\n]`)
const wsErrHandler = err => console.error(`[websocket error:\n${err}\n]`)
const wsCloseHandler = (/*code, reason*/) => console.log('[closed connection]')
function wsMsgHandler(pack) {  // this === ws
  const sack = JSON.parse(pack)
  const res = classifier.classify(sack.message)  // map incoming to response
  console.log(`[session ${sack.session} incoming: ${sack.message}]`)
  console.log(`[session ${sack.session} response: ${res}]`)
  this.send(JSON.stringify({ session: sack.session, message: res }))
}

wsserver.on('error', wsServerErrHandler)

wsserver.on('connection', (ws, req) => {  // httpreq 2nd argument
  console.log('[new connection]')
  ws.session = url.parse(req.url, true).query.session
  ws.on('error', wsErrHandler)
  ws.on('close', wsCloseHandler)
  ws.on('message', wsMsgHandler)
})

console.log(`[wsserver listening on port ${port}]`)
