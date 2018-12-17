import 'get-own-property-symbols'
import 'proxy-polyfill'
import Bigneon from 'bn-api-node'
import {AsyncStorage} from 'react-native'
// import mocker from './mocker'
import {apiURL, timeout} from './config'
import Base64 from './base64'


const DEFAULT_ERROR_MSG =  'There was a problem.'

function buildErrorMessage({error, fields}) {
  let msg = error

  if (typeof fields === 'object') {
    const fieldsString = Object
      .keys(fields)
      .map(name => fields[name].map(x => x.code).join('\n'))
      .join('\n')

    msg = [
      msg,
      fieldsString,
    ].join('\n\n')
  }

  return msg
}

export function apiErrorAlert(error, msg = DEFAULT_ERROR_MSG) {
  const {response} = error

  if (!response) {
    throw error
  }

  const {data} = response

 return alert(data && data.error && buildErrorMessage(data) || msg)
}

export async function retrieveTokens() {
  const [userToken, refreshToken] = await AsyncStorage.multiGet(['userToken', 'refreshToken']);

  user = userToken[1] ? userToken[1] : false
  refresh = refreshToken[1] ? refreshToken[1] : false

  return {userToken: user, refreshToken: refresh}
}

export const bigneonServer = new Bigneon.Server({prefix: apiURL, timeout: timeout})// , {}, mocker)

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');

  return JSON.parse(Base64.atob(base64));
}

function needsRefresh(token) {
  if (!token) {
    return false
  }

  const user = parseJwt(token)

  return (user && user.exp < Math.floor(Date.now() / 1000))
}

/* eslint-disable camelcase */
export async function refreshWithToken(token) {
  const resp = await bigneonServer.auth.refresh({refresh_token: token})
  const {data: {access_token, refresh_token}} = resp

  const _setTokens = await AsyncStorage.multiSet([['userToken', access_token], ['refreshToken', refresh_token]])
  const _setAPIToken = await bigneonServer.client.setToken(access_token)
}

async function refresher() {
  const {userToken, refreshToken} = await retrieveTokens()

  // if expired, refresh
  if (userToken && needsRefresh(userToken)) {
    await refreshWithToken(refreshToken)
  }
}

function wrapInTokenRefresher(fn) {
  return async (...args) => {
    await refresher()
    return await fn(...args)
  }
}

function proxyGet(server, prop) {
  if (prop === 'withoutToken') {
    return server
  }

  const value = server[prop]

  if (typeof value === 'function') {
    return wrapInTokenRefresher(value)
  }

  if (typeof value === 'object') {
    return new Proxy(value, {get: proxyGet})
  }

  return value
}

export const server = new Proxy(bigneonServer, {get: proxyGet})
