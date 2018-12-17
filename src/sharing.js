import {Platform, Share} from 'react-native'
import {baseURL} from './constants/config'

function appendForAndroid(message, url) {
  return Platform.OS === 'android' ? `${message} ${url}` : message
}

export function shareEvent({id, name, venue}) {
  const url = `${baseURL}/events/${id}`
  const title = `${name} is at ${venue.name}`
  const message = appendForAndroid(`Check this out, ${title}. Tickets are on Big Neon.`, url)

  Share.share({
    message,
    url,
    title,
    subject: title,
    dialogTitle: title,
  })
}
