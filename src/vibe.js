import { Vibration } from 'react-native'

const VIBE_ON = 500 // iOS ignores this param and always chooses ~500ms, so that's why we did 500ms
const VIBE_OFF = 100

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function pulse(count) {
  while (count--) {
    Vibration.vibrate(VIBE_ON)
    await sleep(VIBE_ON)
    Vibration.cancel()
    await sleep(VIBE_OFF)
  }
}

export async function happy() {
  return await pulse(1)
}

export async function sad() {
  return await pulse(3)
}
