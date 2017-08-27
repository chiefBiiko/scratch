const natural = require('natural')

// map data structure for approximate string key matching

// approximate mapping using the Jaro-Winkler distance
class ApproxMap extends Map {
  constructor() {
    super()
  }
  approx(key, threshold=.7) {
    if (this.has(key)) return this.get(key)
    if (typeof(key) !== 'string') return undefined  // below requires string
    return this._approx(key=key, threshold=threshold)
  }
  _approx(key, threshold) {
    const _ram = new Map()
    Array.from(this.entries()).forEach(entry => {
      const inrmax = Math.max(...entry[0].map(template => {
        if (typeof(template) !== 'string') return 0
        return natural.JaroWinklerDistance(template, key)
      }))
      _ram.set(inrmax, entry[1])
    })
    const maxscore = Math.max(...Array.from(_ram.keys()))
    //console.log(maxscore)
    return maxscore >= threshold ? _ram.get(maxscore) : undefined
  }
}

var appmap = new ApproxMap()
appmap.set(['what your business?', 'whats ur buiz'], 'fraud')
appmap.set(['what your name?', 'whats ur name', 'yo name?'], 'fraudster')
console.log(appmap.approx('ur name'))
//console.log(natural.JaroWinklerDistance("dixon different","dicksonx hello more words very strange now"))
