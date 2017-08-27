const auth = require('./auth-channel')
const ChatBot = require('./bot/chatbot')
const nodeFlag = require('node-flag')
const path = require('path')
const WebSocket = require('ws')

//const loadClassifier = require(path.join(__dirname, 'nlp', 'load-classifier'))
//const bayes = loadClassifier(path.join(__dirname, 'nlp', 'classifier.json'))

const host = process.argv[3] || '127.0.0.1'
const port = /^\d+$/.test(process.argv[4]) ? Number(process.argv[4]) : 50001
const wsserver = new WebSocket.Server({ host: host, port: port })
var consumer
if (nodeFlag.isset('consumer')) consumer = new auth.Consumer(port - 1001)

// websocketclient handlers
const wsErrHandler = err => console.error(`[websocket error: ${err}]`)
const wsCloseHandler = (/*code, reason*/) => console.log('[closed connection]')
function wsMsgHandler(pack) {  // this === ws
  const sack = JSON.parse(pack)
  var res
  if (consumer && !consumer.validUsers.has(sack.session)) {
    res = 'you are unauthorized'
  } else {
    res = this.chatbot.respond(sack.message)
  //res = sack.message
  //res = bayes.classify(sack.message)  // map incoming to response
  }
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
