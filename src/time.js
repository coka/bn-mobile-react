import {DateTime} from 'luxon'

const DEFAULT_TIME_ZONE = 'America/Los_Angeles'

export function eventDateTimes({door_time, event_start, event_end}) {
  const toDateTime = (iso) => iso ? DateTime.fromRFC2822(iso, {setZone: true}) : null

  return {
    door_time: toDateTime(door_time),
    event_start: toDateTime(event_start),
    event_end: toDateTime(event_end),
  }
}

export function eventIsInPast({event_start}) {
  return DateTime.fromISO(event_start) < DateTime.local()
}
