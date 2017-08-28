const ApproxMap = require('./approx-map')
const BOOT = require('./boot-brain')

class ChatBot {
  constructor() {
    this.appmap = new ApproxMap(BOOT)
  }
  genericResponse(incoming, cutoff=this.appmap.cutoff) {
    return this.appmap.approx(incoming, cutoff)
  }
  promptSelection(message, options) {
    console.error('.promptSelection(message: string, options: string[]) ' +
                  'not yet implemented...')
  }
  respond(incoming) {
    return this.genericResponse(incoming) || 'sorry i didnt get that'
  }
}

module.exports = ChatBot
