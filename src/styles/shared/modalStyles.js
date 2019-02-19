import {
  white,
  primaryColor,
  textColor,
  sectionHeaderColor,
  boxShadowColor,
  globalFontRegular,
  globalFontSemiBold,
  containerDarkColor,
  sectionHeaderFontSize,
  iconFontSize,
  globalPaddingTiny,
  globalPaddingSmall,
  globalPadding,
  globalPaddingMedium,
  globalPaddingLarge,
  globalPaddingJumbo,
  globalMargin,
  globalMarginSmall,
} from '../shared/sharedStyles'
import {StyleSheet, Dimensions, Platform} from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

export const whiteTransparent = 'rgba(255, 255, 255, 0.10)'
export const modalBkgdColor = 'rgba(0, 0, 0, 0.5)'

export const headerFontSize = 32

const ModalStyles = {
  // CONTAINER STYLES
  modalContainer: {
    backgroundColor: modalBkgdColor,
    flexDirection: 'column',
    height: fullHeight,
    justifyContent: 'center',
    paddingHorizontal: globalPadding
  },
  contentWrapper: {
    alignItems: 'center',
    backgroundColor: containerDarkColor,
    paddingHorizontal: globalPadding,
    paddingVertical: globalPaddingJumbo,
    borderRadius: 6
  },
  contentRoundedWrapper: {
    backgroundColor: containerDarkColor,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    height: fullHeight - 225,
    marginHorizontal: globalMargin,
    marginTop: globalMargin,
    overflow: 'hidden',
  },
  modalDropdownContainer: {
    backgroundColor: white,
    borderColor: white,
    height: fullHeight,
    marginTop: globalMargin,
    width: fullWidth,
  },
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: globalPaddingSmall + globalPaddingTiny,
  },

  // ACTIVITY INDICATOR
  activityIndicator: {
    alignItems: 'center',
    backgroundColor: containerDarkColor,
    borderRadius: 20/2,
    justifyContent: 'space-around',
    height: 100,
    width: 100,
  },

  // EMOJI ACTIVITY INDICATOR
  emojiActivityIndicator: {
    height: 53,
    width: 35,
  },

  // IMAGE STYLES
  qrCode: {
    height: 250,
    width: 250,
  },

  // ICON STYLES
  locationIcon: {
    color: primaryColor,
    fontSize: headerFontSize,
    paddingRight: globalPaddingSmall,
  },

  // TEXT STYLES
  header: {
    color: textColor,
    fontFamily: globalFontRegular,
    fontSize: headerFontSize,
    paddingVertical: globalPaddingLarge,
    textAlign: 'center',
  },
  headerSecondary: {
    color: textColor,
    fontFamily: globalFontRegular,
    fontSize: sectionHeaderFontSize,
    paddingVertical: globalPadding,
    textAlign: 'center',
  },
  locationText: {
    fontFamily: globalFontSemiBold,
    fontSize: headerFontSize,
    textAlign: 'right',
  },
  sectionHeader: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: iconFontSize,
  },

  // BUTTON STYLES
  bottomRadius: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    overflow: 'hidden',
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...ModalStyles, ...overrides})
}

export default {
  createStyles,
}
