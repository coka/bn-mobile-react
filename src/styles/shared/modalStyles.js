import {
  white,
  primaryColor,
  textColor,
  sectionHeaderColor,
  globalFontRegular,
  globalFontSemiBold,
  containerDarkColor,
  iconFontSize,
  globalPaddingTiny,
  globalPaddingSmall,
  globalPadding,
  globalPaddingLarge,
  globalPaddingJumbo,
  globalMargin,
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
    paddingHorizontal: globalPadding,
  },
  contentWrapper: {
    alignItems: 'center',
    backgroundColor: containerDarkColor,
    paddingHorizontal: globalPadding,
    paddingVertical: globalPaddingJumbo,
  },
  modalDropdownContainer: {
    backgroundColor: white,
    height: fullHeight,
    marginTop: globalMargin,
    width: fullWidth,
  },
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: globalPaddingSmall + globalPaddingTiny,
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
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...ModalStyles, ...overrides})
}

export default {
  createStyles,
}
