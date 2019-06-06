import Big from 'big.js'

export function toDollars(item, decimalPlaces = 2) {
  return new Big(item)
    .div(100)
    .round(decimalPlaces)
    .toFixed(decimalPlaces)
}
