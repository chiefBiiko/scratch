const ApproxMap = require('./approx-map')
const BOOT = require('./base-brain')

class ChatBot {
  constructor() {
    this.appmap = new ApproxMap(BOOT)
  }
  respond(incoming) {
    return this.appmap.approx(incoming) || 'sorry i didnt get that'
  }
}

module.exports = ChatBot
