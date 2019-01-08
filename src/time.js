import {DateTime} from 'luxon'

const DEFAULT_TIME_ZONE = 'America/Los_Angeles'

export function eventDateTimes({door_time, event_start, venue: {timezone}}) {
  const toDateTime = (iso) => DateTime.fromISO(iso, {zone: 'utc'}).setZone(timezone || DEFAULT_TIME_ZONE)
  
  return {
    door_time: toDateTime(door_time),
    event_start: toDateTime(event_start),
  }
}

export function eventIsInPast({event_start}) {
  return DateTime.fromISO(event_start) < DateTime.local()
}
