import {Constants} from 'expo'

const RELEASE_CHANNEL = Constants.manifest.releaseChannel || 'dev'
const WEB_STAGING = 'https://beta.bigneon.com'
const API_STAGING = 'https://api.staging.bigneon.com'
const CLOUDINARY_CLOUD_STAGING = 'bigneon-dev'
const CLOUDINARY_UPLOAD_PRESET_STAGING = 'dthcf8uc'
const WEB_PRODUCTION = 'https://prod-1-mobile-www.bigneon.com'
const API_PRODUCTION = 'https://api.production.bigneon.com'

const SEGMENT_ANDROID_STAGING = 'juWgBzBtJX0DRiJLcw5UoGqFVZpiYi9j'
const SEGMENT_IOS_STAGING = 'ew0hTJ9I33lME9Y9UNLAiAw4A9rjeyFV'
const SEGMENT_ANDROID_PRODUCTION = 'XZRPUZtqgXU4diulRekh7nV3Z2sHZS6f'
const SEGMENT_IOS_PRODUCTION = 'x6xb253zBvxlkW6l4wBGGuf8whD07f41'

const defaultConfig = {
  timeout: 10000,
}

const dev = {
  ...defaultConfig,
  baseURL: WEB_STAGING,
  stripeFormURL: WEB_STAGING,
  apiURL: API_STAGING,
  timeout: 3000,
  cloudinaryCloud: CLOUDINARY_CLOUD_STAGING,
  cloudinaryUploadPreset: CLOUDINARY_UPLOAD_PRESET_STAGING,
  androidWriteKey: SEGMENT_ANDROID_STAGING,
  iosWriteKey: SEGMENT_IOS_STAGING,
}

const staging = {
  ...dev,
}

const production = {
  ...defaultConfig,
  baseURL: WEB_PRODUCTION,
  stripeFormURL: WEB_PRODUCTION,
  apiURL: API_PRODUCTION,
  androidWriteKey: SEGMENT_ANDROID_PRODUCTION,
  iosWriteKey: SEGMENT_IOS_PRODUCTION,
}

module.exports = {dev, staging, production}[RELEASE_CHANNEL]
