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
  constructor(initDocs, cutoff = .75) {
    super()
    if (Array.isArray(initDocs)) initDocs.forEach(doc => this.set(...doc))
    this.cutoff = typeof(cutoff) === 'number' && cutoff > 0 && cutoff <= 1 ?
      cutoff : .7
  }
  approx(key, cutoff=this.cutoff) {
    var ram, maxscore
    if (!this._isString(key)) {
      throw new TypeError('.approx(key: string, cutoff: number)')
    }
    ram = new Map()
    this.forEach((value, keyarr) => {
      const inrmax = Math.max(...JSON.parse(keyarr).map(template => {
        return natural.JaroWinklerDistance(template, key)
      }))
      ram.set(inrmax, value)
    })
    maxscore = Math.max(...ram.keys())
    return maxscore >= cutoff ? ram.get(maxscore) : undefined
  }
  get(keyarr) {
    const search = JSON.stringify(keyarr)
    const keys = Array.from(this.keys())
    const vals = Array.from(this.values())
    const hitkey = keys.filter(k => k === search)[0]
    return hitkey ? vals[keys.indexOf(hitkey)] : undefined
  }
  has(keyarr) {
    const search = JSON.stringify(keyarr)
    return Array.from(this.keys()).some(k => k === search)
  }
  delete(keyarr) {
    super.delete(JSON.stringify(keyarr))
    return this
  }
  set(keyarr, value) {
    if (!Array.isArray(keyarr) ||
        !keyarr.every(this._isString) || !this._isString(value)) {
      throw new TypeError('.set(keyarr: string[], value: string)')
    }
    super.set(JSON.stringify(keyarr), value)
    return this
  }
  _isString(x) {
    return typeof(x) === 'string' || x instanceof String
  }
}

module.exports = ApproxMap
