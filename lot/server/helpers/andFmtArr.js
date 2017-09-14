'use strict'

module.exports = arr => {
  const tail = arr.length - 1
  if (tail < 1) return arr.join()
  return `${arr.slice(0, tail).join(', ')}, and ${arr[tail]}`
}
