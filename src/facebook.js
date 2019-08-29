import * as Facebook from 'expo-facebook';
import Constants from 'expo-constants';
import {Platform} from 'react-native'
import {server} from './constants/Server'

const BEHAVIOR = Platform.OS === 'ios' ? 'web' : 'system'
const appId = Constants.manifest.facebookAppId
const options = {
  permissions: ['public_profile', 'email'],
  behavior: BEHAVIOR,
}

export async function requestFacebookAuth() {
  const {type, ...result} = await Facebook.logInWithReadPermissionsAsync(appId, options)

  if (type === 'success') {
    return result
  }

  return null
}

// https://docs.expo.io/versions/latest/sdk/facebook/#facebookloginwithreadpermissionsasyncappid-options
export async function connectFacebookToBigNeon({token: accessToken, expires: expiresIn}) {
  return await server.external.facebookLogin({accessToken, expiresIn, signedRequest: ' '})
}
