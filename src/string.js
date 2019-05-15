import Big from 'big.js'

const NAME_MISSING = '[unknown]'

// Typically used with React TextInput `onChangeText.
// Takes a 1-arg function and returns a function that trims the arg if it's a string.
export function autotrim(fn) {
  return (value) => fn(typeof value === 'string' ? value.trim() : value)
}

export function pluralize(count, singular, plural = null) {
  const noun = count === 1 ? singular : plural || `${singular}s`

  return `${count} ${noun}`
}

function buildName(parts, joiner, email) {
  return (
    parts
      .filter((x) => x)
      .join(joiner)
      .trim() ||
    email ||
    NAME_MISSING
  )
}

export function username({first_name: first, last_name: last, email}) {
  return buildName([first, last], ' ', email)
}

export function usernameLastFirst({first_name: first, last_name: last, email}) {
  return buildName([last, first], ', ', email)
}

export function price(cents) {
  if (cents === 0) {
    return 'Free'
  }

  const dollars = new Big(cents)
    .div(100)
    .round(2)
    .toFixed(2)
    .replace(/\.00$/, '')

  return `$${dollars}`
}
