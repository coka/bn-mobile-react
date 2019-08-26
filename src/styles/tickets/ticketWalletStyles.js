import {
  isSmallDevice,
  primaryColor,
  white,
  containerDarkColor,
  sectionHeaderColor,
  globalFontSizeSmaller,
  globalFontSizeSmall,
  globalFontSize,
  globalFontSizeMedium,
  globalFontMedium,
  globalFontRegular,
  globalPaddingLarge,
  globalPadding,
  globalPaddingSmall,
  globalPaddingTiny,
} from '../shared/sharedStyles'
import { StyleSheet, Dimensions, Platform } from 'react-native'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'
const fullHeight = Dimensions.get('window').height

export const fullWidth = Dimensions.get('window').width

function wp(percentage) {
  const value = (percentage * fullWidth) / 100

  return Math.round(value)
}
const slideWidth = wp(100)
const itemHorizontalMargin = wp(2)

export const itemWidth = slideWidth + itemHorizontalMargin * 2
export const whiteTransparent = 'rgba(255, 255, 255, 0.8)'

const TicketWalletStyles = {
  // CONTAINER STYLES
  modalContainer: {
    flexDirection: 'column',
    height: fullHeight,
    justifyContent: 'center',
  },
  closeModalContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: globalPadding,
  },
  slideWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: globalPadding,
  },
  ticketContainerBottom: {
    backgroundColor: white,
    marginTop: -10,
    padding: isSmallDevice ? globalPaddingSmall : globalPadding,
    width: fullWidth - 43,
  },
  detailsContainerBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: globalPaddingSmall + globalPaddingTiny,
    paddingVertical: globalPaddingSmall,
  },

  // IMAGE STYLES
  eventImageWrapper: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    position: 'absolute',
  },
  eventImage: {
    height: 180,
    width: fullWidth - 43,
  },
  modalBkgdImage: {
    height: fullHeight,
    width: fullWidth,
    position: 'absolute',
  },

  // TEXT STYLES
  closeModalHeader: {
    color: white,
    fontFamily: globalFontMedium,
    fontSize: globalFontSizeMedium,
  },
  details: {
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeSmall,
    color: white,
    paddingRight: globalPaddingSmall,
    paddingVertical: globalPaddingTiny,
  },

  // AVATAR STYLES
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingRight: globalPaddingSmall,
  },
  avatar: {
    borderColor: 'transparent',
    borderRadius: 45 / 2,
    borderWidth: 1,
    height: 45,
    width: 45,
  },

  // ICON STYLES
  iconLink: {
    backgroundColor: 'transparent',
    color: whiteTransparent,
    fontSize: globalFontSizeSmall,
    paddingRight: globalPaddingTiny,
  },
  iconLinkText: {
    color: whiteTransparent,
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeSmaller,
    paddingRight: globalPaddingTiny,
  },

  // QR CODE STYLES
  qrCodeContainer: {
    backgroundColor: containerDarkColor,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: globalPadding,
    width: fullWidth - 43,
  },
  qrCode: {
    height: 200,
    width: 200,
  },

  // PLACEHOLDER STYLES
  placeholderCard: {
    backgroundColor: white,
    borderRadius: 6,
    padding: globalPadding,
    width: 280,
  },
  placeholderText: {
    fontFamily: globalFontMedium,
    fontSize: globalFontSizeSmall,
  },

  // BOTTOM NAV STYLES
  bottomNav: {
    backgroundColor: white,
    borderBottomRightRadius: 20 / 2,
    borderBottomLeftRadius: 20 / 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: fullWidth - 43,
  },
  bottomNavLinkContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: globalPaddingSmall + globalPaddingTiny,
    padding: globalPadding,
  },
  bottomNavIcon: {
    color: primaryColor,
    fontSize: globalFontSize,
    paddingHorizontal: globalPaddingTiny,
  },
  bottomNavLinkText: {
    color: sectionHeaderColor,
    fontFamily: globalFontMedium,
  },
  paddingTop: {
    paddingTop: verticalScale(40),
  },
  customContactListPadding: {
    paddingTop: 45,
    paddingBottom: 10,
  }
}

function createStyles(overrides = {}) {
  return StyleSheet.create({ ...TicketWalletStyles, ...overrides })
}

export default {
  createStyles,
  fullWidth,
  itemWidth,
}
