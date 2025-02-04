import {
  primaryColor,
  textColor,
  sectionHeaderColor,
  white,
  borderColor,
  disabledHeaderColor,
  globalFontSizeSmaller,
  globalFontSizeSmall,
  globalFontSize,
  globalFontSizeLarge,
  globalFontSizeLargest,
  globalFontRegular,
  globalFontMedium,
  globalPadding,
  globalPaddingSmall,
  globalPaddingTiny,
  globalMarginSmall,
} from '../shared/sharedStyles'
import { StyleSheet, Dimensions, Platform } from 'react-native'
const fullWidth = Dimensions.get('window').width

export const whiteTransparent = 'rgba(255, 255, 255, 0.8)'

const AccountStyles = {
  // ACCOUNT COVER PHOTO STYLES
  accountBkgdContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 240,
  },
  accountBkgd: {
    width: fullWidth,
    height: 240,
    position: 'absolute',
  },
  accountPhotoContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 290,
    justifyContent: 'center',
    paddingTop: globalPadding,
    width: fullWidth,
  },
  accountPhotoText: {
    color: whiteTransparent,
    fontSize: globalFontSizeSmaller,
  },

  // AVATAR STYLES
  avatarPlaceholderContainer: {
    backgroundColor: sectionHeaderColor,
    borderColor: white,
    borderWidth: 1,
    borderRadius: 100 / 2,
    height: 55,
    marginTop: -50,
    padding: globalPaddingSmall,
    width: 55,
  },
  avatarContainer: {
    width: 120,
  },
  avatarIcon: {
    color: white,
    fontSize: globalFontSizeLargest,
  },

  // ACCOUNT INFO STYLES
  accountHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: globalPadding,
    paddingTop: globalPaddingSmall,
  },
  accountEmailHeader: {
    color: textColor,
    fontFamily: globalFontMedium,
    fontSize: globalFontSizeLarge,
  },
  emailWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: globalPaddingTiny,
  },
  emailIcon: {
    color: sectionHeaderColor,
    fontSize: globalFontSizeSmall,
    paddingRight: globalPaddingTiny,
  },
  accountEmail: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeSmaller,
  },
  qrCodeSmall: {
    height: 45,
    width: 45,
  },

  // CONTAINER STYLES
  sectionHeader: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeSmall,
    marginBottom: globalMarginSmall,
    paddingHorizontal: globalPadding,
  },

  // ROW STYLES
  rowContainer: {
    alignItems: 'center',
    backgroundColor: white,
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: globalPadding,
    paddingVertical: globalPaddingSmall,
    width: fullWidth,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  // ACCOUNT SUBNAV STYLES
  accountIcon: {
    color: sectionHeaderColor,
    fontSize: globalFontSizeSmall,
    paddingRight: globalPaddingSmall,
  },
  accountIconActive: {
    color: primaryColor,
    fontSize: globalFontSizeSmall,
    paddingRight: globalPaddingSmall,
  },
  accountHeader: {
    color: textColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSize,
  },
  accountArrow: {
    color: sectionHeaderColor,
    fontSize: globalFontSizeLargest,
  },

  // INPUT STYLES
  inputContainer: {
    alignItems: 'center',
    backgroundColor: white,
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 45,
    justifyContent: 'space-between',
    paddingHorizontal: globalPadding,
    width: fullWidth,
  },
  accountInputHeader: {
    color: textColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSize,
    width: fullWidth,
  },
  accountInputHeaderDisabled: {
    color: disabledHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSize,
    width: 120,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({ ...AccountStyles, ...overrides })
}

export default {
  createStyles,
}
