// Typically used with React TextInput `onChangeText.
// Takes a 1-arg function and returns a function that trims the arg if it's a string.
export function autotrim(fn) {
  return (value) => fn(typeof value === 'string' ? value.trim() : value)
}
