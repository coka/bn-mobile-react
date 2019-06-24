import {
  primaryColor,
  white,
  textColor,
  pillContainerColor,
  sectionHeaderColor,
  successColor,
  errorColor,
  errorTextColor,
  globalFontSizeSmaller,
  globalFontSizeSmall,
  globalFontSize,
  globalFontSizeLarge,
  globalFontSizeLargest,
  globalFontSizeJumbo,
  globalFontSemiBold,
  globalFontRegular,
  globalPaddingSmall,
  globalPadding,
  globalPaddingLarge,
} from '../shared/sharedStyles'
import {StyleSheet, Dimensions} from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

export const iconFontSize = globalFontSizeSmall * 2
export const statusMessageIconFontSize = globalFontSizeLargest * 2

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
    borderRadius: 100 / 2,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: globalPaddingSmall,
    paddingVertical: globalPaddingSmall,
  },
  pillTextWhite: {
    color: white,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSize,
  },
  pillTextPrimary: {
    color: primaryColor,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeSmall,
  },
  pillTextSubheader: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeSmaller,
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
    fontSize: globalFontSizeSmall,
    paddingHorizontal: globalPaddingSmall,
  },

  // TEXT STYLES
  descriptionHeader: {
    color: textColor,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeLarge,
    width: 275,
  },

  // MESSAGE STYLES
  messageText: {
    color: white,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeJumbo,
    paddingBottom: globalPaddingLarge,
  },
  messageFooter: {
    color: white,
    fontSize: globalFontSizeSmall,
    paddingBottom: globalPaddingSmall,
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
