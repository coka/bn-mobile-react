import * as Segment from 'expo-analytics-segment'
import { iosWriteKey, androidWriteKey } from './config'

export function analyticsInit() {
  Segment.initialize({ androidWriteKey, iosWriteKey })
}

export async function identify(params) {
  const { id, firstName, lastName, email } = params

  Segment.identifyWithTraits(id, { firstName, lastName, email })
}

export function track(action) {
  Segment.track(action)
}
