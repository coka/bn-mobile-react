import {
  primaryColor,
  white,
  textColor,
  pillContainerColor,
  sectionHeaderColor,
  successColor,
  errorColor,
  errorTextColor,
  bodyFontSize,
  subnavFontSize,
  headerSecondaryFontSize,
  sectionHeaderFontSize,
  globalFontSemiBold,
  globalFontRegular,
  globalPaddingTiny,
  globalPaddingSmall,
  globalPadding,
  globalPaddingLarge,
  globalMargin,
} from '../shared/sharedStyles'
import {StyleSheet, Dimensions, Platform} from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

export const pillHeaderFontSize = 18
export const iconFontSize = 32
export const statusMessageTextFontSize = 36
export const statusMessageIconFontSize = 60

const EventScannerStyles = {
  // CONTAINERS
  eventScannerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: fullHeight,
  },
  headerActionsWrapper: {
    alignItems: 'center',
    paddingHorizontal: globalPadding,
    paddingTop: globalPaddingLarge,
  },
  messageContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  // MAIN BODY STYLES
  mainBody: {
    backgroundColor: 'transparent',
    paddingLeft: 0,
    paddingRight: 0,
    paddingHorizontal: 0,
  },

  // PILLS
  pillContainer: {
    alignItems: 'center',
    backgroundColor: pillContainerColor,
    borderColor: 'transparent',
    borderRadius: 100/2,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: globalPaddingSmall,
    paddingVertical: globalPaddingSmall,
  },
  pillTextWhite: {
    color: white,
    fontFamily: globalFontSemiBold,
    fontSize: pillHeaderFontSize,
  },
  pillTextPrimary: {
    color: primaryColor,
    fontFamily: globalFontSemiBold,
    fontSize: bodyFontSize,
  },
  pillTextSubheader: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: subnavFontSize,
  },

  // IMAGES
  scannerBkgdImage: {
    height: fullHeight,
    width: fullWidth,
    position: 'absolute',
  },

  // ICONS
  checkIcon: {
    color: successColor,
    fontSize: iconFontSize,
    paddingHorizontal: globalPaddingSmall,
  },
  arrowUpIcon: {
    color: sectionHeaderColor,
    fontSize: bodyFontSize,
    paddingHorizontal: globalPaddingSmall,
  },

  // TEXT STYLES
  descriptionHeader: {
    color: textColor,
    fontFamily: globalFontSemiBold,
    fontSize: headerSecondaryFontSize,
    width: 275,
  },

  // MESSAGE STYLES
  messageText: {
    color: white,
    fontFamily: globalFontSemiBold,
    fontSize: statusMessageTextFontSize,
  },
  messageIconError: {
    color: errorColor,
    fontSize: statusMessageIconFontSize,
    paddingBottom: globalPaddingSmall,
  },
  messageIconSuccess: {
    color: successColor,
    fontSize: statusMessageIconFontSize,
    paddingBottom: globalPaddingSmall,
  },
  messageIconCancel: {
    color: errorTextColor,
    fontSize: statusMessageIconFontSize,
    paddingBottom: globalPaddingSmall,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...EventScannerStyles, ...overrides})
}

export default {
  createStyles,
}
