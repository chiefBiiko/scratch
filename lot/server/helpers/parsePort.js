'ùse strict'

module.exports = argv => /^\d+$/.test(argv) ? Number(argv) : null
