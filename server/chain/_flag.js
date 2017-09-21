'use strict'

module.exports = (e, next) => {
  Object.keys(e.stash.hitProducts).forEach(product => {
    e.stash.hitProducts[product].flags = {
      features:
        RegExp(`(features?.{0,23}(the)?${product})|` +
               `(${product}.{0,23}features?)`, 'i')
          .test(e.text),
      pictures:
        RegExp(`(pictures?.{0,23}(the)?${product})|` +
               `(${product}.{0,23}pictures?)`, 'i')
          .test(e.text),
      price:
        RegExp(`((price)|(cost).{0,23}(the)?${product})|` +
               `(${product}.{0,23}(price)|(cost))`, 'i')
          .test(e.text),
      ratings:
        RegExp(`((ratings?)|(reviews?).{0,23}(the)?${product})|` +
               `(${product}.{0,23}(ratings?)|(reviews?))`, 'i')
          .test(e.text),
      wantsMinRating:
        RegExp(`(min)|(minimum)|(worst)|(badd?est)\s*(rating)|(review).{0,23}` +
               `(the)?\s*${product}`, 'i')
          .test(e.text),
      wantsMaxRating:
        RegExp(`(max)|(maximum)|(best)|(highest)\s*(rating)|(review).{0,23}` +
               `(the)?\s*${product}`, 'i')
          .test(e.text),
      wantsAvgRating:
        RegExp(`(avg)|(average)|(mean)|(median)|(mid(dle)?)\s*` +
               `(rating)|(review).{0,23}(the)?\s*${product}`, 'i')
          .test(e.text)
    }
  })
  next(null, e)
  return e // 4 dev tests only
}
