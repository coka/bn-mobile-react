import Big from 'big.js'

export function toDollars(item, fixed = 0) {
  return new Big(item).div(100).toFixed(fixed)
}