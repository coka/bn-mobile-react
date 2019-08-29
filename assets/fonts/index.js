import * as Font from 'expo-font'

/* eslint-disable camelcase */
const FONTS = {
  tt_commons_black: require('./tt_commons_black.ttf'),
  tt_commons_black_italic: require('./tt_commons_black_italic.ttf'),
  tt_commons_bold: require('./tt_commons_bold.ttf'),
  tt_commons_bold_italic: require('./tt_commons_bold_italic.ttf'),
  tt_commons_demibold: require('./tt_commons_demibold.ttf'),
  tt_commons_demibold_italic: require('./tt_commons_demibold_italic.ttf'),
  tt_commons_extrabold: require('./tt_commons_extrabold.ttf'),
  tt_commons_extrabold_italic: require('./tt_commons_extrabold_italic.ttf'),
  tt_commons_extralight: require('./tt_commons_extralight.ttf'),
  tt_commons_extralight_italic: require('./tt_commons_extralight_italic.ttf'),
  tt_commons_italic: require('./tt_commons_italic.ttf'),
  tt_commons_light: require('./tt_commons_light.ttf'),
  tt_commons_light_italic: require('./tt_commons_light_italic.ttf'),
  tt_commons_medium: require('./tt_commons_medium.ttf'),
  tt_commons_medium_italic: require('./tt_commons_medium_italic.ttf'),
  tt_commons_regular: require('./tt_commons_regular.ttf'),
  tt_commons_thin: require('./tt_commons_thin.ttf'),
  tt_commons_thin_italic: require('./tt_commons_thin_italic.ttf'),
}

export async function loadFonts() {
  return await Font.loadAsync(FONTS)
}
