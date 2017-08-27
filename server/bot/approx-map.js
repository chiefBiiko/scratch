const natural = require('natural')
/*
  map data structure for approximate string mapping
  maps a search key to a value if any of its key arrays contains a string with
  a Jaro-Winkler similarity >= threshold
  the highest score always dominates
  a key must be a string[], a value must be a string
  main method:
   ApproxMap.prototype.approx(key: string, threshold: number)
  example:
   const ApproxMap = require('./approx-map')
   const appmap = new ApproxMap()
   appmap.set(['hello', 'hello bot', 'whats up'], 'hi buddy')  // chainable
         .set(['thanks', 'thank you', 'thx'], 'you are welcome')
   console.log(appmap.approx('hallo bot', .9))  // => 'hi buddy'
*/
class ApproxMap extends Map {
  constructor(initDocs, threshold=.7) {
    super()
    if (Array.isArray(initDocs)) {
      initDocs.forEach(doc => this.set(doc[0], doc[1]))
    }
    this.threshold = threshold
  }
  approx(key, threshold=this.threshold) {
    var ram, maxscore
    if (!this._isString(key)) {
      throw new Error('arg types: .approx(key: string, threshold: number)')
    }
    ram = new Map()
    this.forEach((value, keyarr) => {
      const inrmax = Math.max(...keyarr.map(template => {
        return natural.JaroWinklerDistance(template, key)
      }))
      ram.set(inrmax, value)
    })
    maxscore = Math.max(...Array.from(ram.keys()))
    return maxscore >= threshold ? ram.get(maxscore) : undefined
  }
  get(key) {
    const keys = Array.from(this.keys())
    const vals = Array.from(this.values())
    const hitkey = keys.filter(k => k.toString() === key.toString())[0]
    return hitkey ? vals[keys.indexOf(hitkey)] : undefined
  }
  has(key) {
    return Array.from(this.keys()).some(k => k.toString() === key.toString())
  }
  delete(key) {
    console.log('ApproxMap is append-only so far\n' +
                '.delete(key: string[]) not yet implemented')
    return this
  }
  set(keys, value) {
    if (!Array.isArray(keys) ||
        !keys.every(this._isString) || !this._isString(value)) {
      throw new Error('arg types: .set(string[], string)')
    }
    super.set(keys, value)
    return this
  }
  _isString(x) {
    return typeof(x) === 'string' || x instanceof String
  }
}

module.exports = ApproxMap

var appmap = new ApproxMap()
appmap.set(['hello', 'mello'], 'greeting').set(['poop'], 'noop')
console.log(appmap.get(['hello', 'mello']))
console.log(appmap.approx('hoop'))
