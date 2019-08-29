import {server} from './constants/Server'
import { Notifications } from 'expo';

import * as Permissions from 'expo-permissions';

/*

From https://docs.expo.io/versions/latest/guides/push-notifications ...

"Note: iOS and Android simulators cannot receive push notifications.
To test them out you will need to use a real-life device.
Additionally, when calling Permissions.askAsync on the simulator,
it will resolve immediately with "undetermined" as the status,
regardless of whether you choose to allow or not."

*/

function isGranted({status}) {
  return status === 'granted'
}

// If we already have access, just return true.
// Otherwise, ask for access and return whether or not it is granted.
export async function accessPushNotifications() {
  return (
    isGranted(await Permissions.getAsync(Permissions.NOTIFICATIONS)) ||
    isGranted(await Permissions.askAsync(Permissions.NOTIFICATIONS))
  )
}

// Returns the push token if access is granted.
// Returns null if not.
export async function getPushToken() {
  return (await accessPushNotifications()) ?
    await Notifications.getExpoPushTokenAsync() :
    null
}

// TODO: save to API server
export async function savePushToken(token) {
  await server.users.deviceTokens.create({token, token_source: 'expo'})
}

export async function registerPushTokenIfPermitted() {
  try {
    const token = await getPushToken()

    if (token) {
      await savePushToken(token)
    }
  } catch (error) {
    if (error && error.response && error.response.status === 409) {
      console.log(`This device has already stored the token.`);
    } else {
      console.warn(`Unable to get notification token. Error: ${error.message}`)
    }
  }
}
