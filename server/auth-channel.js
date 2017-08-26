const net = require('net')
const streamSet = require('stream-set')

/*
   use like:
   const commander = new Commander(9999)
   // ... broadcast a command:
   commander.cmdAdd('validId')  // or cmdDel('invalidId')
*/
class Commander extends net.Server {
  constructor(port, host='127.0.0.1') {
    super()
    this.activeConsumers = streamSet()
    this.host = host
    this.port = port
    this.on('error', this.errorHandler)
    this.on('connection', this.connectionHandler)
    this.on('listening', this.listeningLogger)
    this.listen(port, host)
  }
  cmdAdd(value) {
    this.activeConsumers.forEach(consumer => {
      consumer.write(`add ${value}`)
    })
  }
  cmdDel(value) {
    this.activeConsumers.forEach(consumer => {
      consumer.write(`delete ${value}`)
    })
  }
  errorHandler(err) {
    console.error(`[auth-channel error:\n${err}\n]`)
  }
  connectionHandler(socket) {
    console.log(`[new auth-channel consumer: ${socket.remoteAddress}:?]`)
    this.activeConsumers.add(socket)
  }
  listeningLogger() {
    console.log(`[auth-channnel commander listening on port ${this.port}]`)
  }
}

/*
   use like:
   const consumer = new Consumer(9999)
   // consumer.validUsers is a Set
   // ...once done - free the socket
   consumer.destroy()
*/
class Consumer extends net.Socket {
  constructor(port, host='127.0.0.1') {
    super()
    this.setEncoding('utf8')
    this.commander = `${host}:${port}`
    this.validUsers = new Set()
    this.on('data', this.dataHandler)
    this.on('error', this.errorHandler)
    this.connect(port, host)
  }
  errorHandler(err) {
    console.error(`[auth-channel error:\n${err}\n]`)
  }
  dataHandler(cmd) {
    console.log(`[received new command: ${cmd}]`)
    if (cmd.startsWith('add')) {
      const value = cmd.replace(/^add/i, '').trim()
      this.validUsers.add(value)
    } else if (cmd.startsWith('delete')) {
      const value = cmd.replace(/^delete/i, '').trim()
      this.validUsers.delete(value)
    }
  }
}

module.exports = { Commander: Commander, Consumer: Consumer }
