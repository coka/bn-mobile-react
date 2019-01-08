import {Constants} from 'expo'

const RELEASE_CHANNEL = Constants.manifest.releaseChannel || 'dev'
const WEB_STAGING = 'https://beta.bigneon.com'
const WEB_PRODUCTION = 'https://prod-1-mobile-www.bigneon.com'
const API_PRODUCTION = 'https://api.bigneon.com'

const defaultConfig = {
  timeout: 10000,
}

const dev = {
  ...defaultConfig,
  baseURL: WEB_STAGING,
  stripeFormURL: WEB_STAGING,
  apiURL: `${WEB_STAGING}/api`,
}

const staging = {
  ...dev,
}

const production = {
  ...defaultConfig,
  baseURL: WEB_PRODUCTION,
  stripeFormURL: WEB_PRODUCTION,
  apiURL: API_PRODUCTION,
}

module.exports = {dev, staging, production}[RELEASE_CHANNEL]
