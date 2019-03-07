import {
  primaryColor,
  textColor,
  sectionHeaderColor,
  white,
  borderColor,
  containerDarkColor,
  disabledHeaderColor,
  bodyFontSize,
  iconFontSize,
  sectionHeaderFontSize,
  globalFontRegular,
  globalFontMedium,
  globalFontSemiBold,
  globalPaddingJumbo,
  globalPaddingLarge,
  globalPaddingMedium,
  globalPadding,
  globalPaddingSmall,
  globalPaddingTiny,
  globalMargin,
  globalMarginSmall,
} from '../shared/sharedStyles'
import {StyleSheet, Dimensions, Platform} from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

export const whiteTransparent = 'rgba(255, 255, 255, 0.5)'
export const facebookColor = '#4267B2'

export const buttonFontSize = 18
export const backButtonFontSize = 28

const LoginStyles = {
  // BACKGROUND IMAGE STYLES
  signupBkgdContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: fullHeight,
  },
  signupBkgd: {
    width: fullWidth,
    height: fullHeight,
    position: 'absolute',
  },
  section: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    height: fullHeight,
    justifyContent: 'space-around',
    paddingHorizontal: globalPadding,
    width: fullWidth,
  },

  // CONTAINERS
  navigationContainer: {
    backgroundColor: white,
    borderBottomColor: white,
  },
  container: {
    backgroundColor: white,
    flex: 1,
    flexDirection: 'column',
    height: fullHeight,
    justifyContent: 'space-between',
    paddingHorizontal: globalPadding,
    paddingVertical: globalPaddingLarge,
    width: fullWidth,
  },
  disclaimerWrapper: {
    paddingTop: globalPaddingLarge,
  },

  // BUTTONS
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: globalMargin,
    width: '100%',
  },
  button: {
    backgroundColor: primaryColor,
    borderColor: 'transparent',
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 60,
    justifyContent: 'center',
  },
  buttonText: {
    color: white,
    fontFamily: globalFontSemiBold,
    fontSize: buttonFontSize,
    textAlign: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderColor: whiteTransparent,
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 60,
    justifyContent: 'center',
  },
  buttonSecondaryText: {
    color: whiteTransparent,
    fontFamily: globalFontRegular,
    fontSize: buttonFontSize,
    textAlign: 'center',
  },
  buttonTertiary: {
    backgroundColor: 'transparent',
    borderColor: disabledHeaderColor,
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 60,
    justifyContent: 'center',
  },
  buttonTertiaryIcon: {
    fontSize: sectionHeaderFontSize,
    paddingRight: globalPaddingSmall,
  },
  buttonTertiaryText: {
    color: textColor,
    fontFamily: globalFontRegular,
    fontSize: buttonFontSize,
    textAlign: 'center',
  },

  // TEXT STYLES
  linkTextBlue: {
    backgroundColor: 'transparent',
    color: facebookColor,
    fontFamily: globalFontMedium,
    fontSize: bodyFontSize,
  },
  mutedText: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: bodyFontSize - 2,
  },
  smallText: {
    backgroundColor: 'transparent',
    fontFamily: globalFontMedium,
    fontSize: bodyFontSize - 2,
    paddingBottom: globalPaddingTiny,
    textAlign: 'center',
  },

  // ICON STYLES
  backButton: {
    fontSize: backButtonFontSize,
    marginLeft: globalMargin,
  },
  arrowIconBlue: {
    color: facebookColor,
  },
  facebookIcon: {
    height: 15,
    marginRight: globalMarginSmall,
    width: 15,
  },
  phoneIcon: {
    fontSize: iconFontSize,
    marginRight: globalMarginSmall,
  },

  // LOGO STYLES
  logo: {
    height: 200,
    marginTop: globalPaddingJumbo,
    width: 135,
  },

  // PROFILE IMAGE STYLES
  profileImageWrapper: {
    paddingTop: globalPaddingLarge,
  },
  profileImage: {
    height: 55,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 55/2,
    marginRight: globalMargin,
    width: 55,
  }
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...LoginStyles, ...overrides})
}

export default {
  createStyles,
}
