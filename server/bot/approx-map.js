const natural = require('natural')

/*
  map data structure for approximate string mapping
  maps a search key to a value if any of its key arrays contains a string with
  a Jaro-Winkler similarity >= threshold
  the highest score always dominates
  ignores case
  with the set methdod a key must be a JSON(string[]), a value must be a string
  when passing initDocs to the constructor these must not contain any JSON
  arrays as keys, rather plain old arrays of strings
  main method:
   ApproxMap.prototype.approx(key: string, threshold: number)
  example:
   const ApproxMap = require('./approx-map')
   const appmap = new ApproxMap()
   const jsonkeyarr = JSON.stringify(['hello', 'hello bot', 'whats up'])
   appmap.set(jsonkeyarr, 'hi buddy')      // actually chainable
   console.log(appmap.get(jsonkeyarr))     // 'hi buddy'
   console.log(appmap.approx('hello'))     // 'hi buddy'
   console.log(appmap.delete(jsonkeyarr))  // this
   console.log(appmap.has(jsonkeyarr))     // false
*/
class ApproxMap extends Map {
  constructor(initDocs, cutoff = .75) {
    super()
    this._initializeDocuments(initDocs)
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
  get(jsonkeyarr) {
    if (!this._isJSONStringArray(jsonkeyarr)) {
      throw new TypeError('.delete(jsonkeyarr: JSON(string[]))')
    }
    const keys = Array.from(this.keys())
    const vals = Array.from(this.values())
    const hitkey = keys.filter(k => k === jsonkeyarr)[0]
    return hitkey ? vals[keys.indexOf(hitkey)] : undefined
  }
  has(jsonkeyarr) {
    if (!this._isJSONStringArray(jsonkeyarr)) {
      throw new TypeError('.delete(jsonkeyarr: JSON(string[]))')
    }
    return Array.from(this.keys()).some(k => k === jsonkeyarr)
  }
  delete(jsonkeyarr) {
    if (!this._isJSONStringArray(jsonkeyarr)) {
      throw new TypeError('.delete(jsonkeyarr: JSON(string[]))')
    }
    super.delete(jsonkeyarr)
    return this
  }
  set(jsonkeyarr, value) {
    if (!this._isJSONStringArray(jsonkeyarr) || !this._isString(value)) {
      throw new TypeError('.set(keyarr: JSON(string[]), value: string)')
    }
    super.set(jsonkeyarr, value)
    return this
  }
  _initializeDocuments(initDocs) {
    if (!initDocs) return
    if (!Array.isArray(initDocs) ||
        !initDocs.every(doc => {
          return Array.isArray(doc[0]) && doc[0].every(this._isString) &&
          this._isString(doc[1])
        })) {
      throw new TypeError('initDocs must have this structure: ' +
                          '[[string[], string], ...]')
    }
    initDocs.forEach(doc => this.set(JSON.stringify(doc[0]), doc[1]))
  }
  _isJSONStringArray(x) {
    var keyarr
    if (!this._isString(x)) return false
    try { keyarr = JSON.parse(x) } catch (err) { return false }
    return Array.isArray(keyarr) && keyarr.every(this._isString)
  }
  _isString(x) {
    return typeof(x) === 'string' || x instanceof String
  }
}

module.exports = ApproxMap
