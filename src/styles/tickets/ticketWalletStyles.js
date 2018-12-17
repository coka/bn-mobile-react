import {
  primaryColor,
  white,
  containerDarkColor,
  sectionHeaderColor,
  bodyFontSize,
  iconFontSize,
  globalFontMedium,
  globalFontRegular,
  globalPaddingLarge,
  globalPadding,
  globalPaddingSmall,
  globalPaddingTiny,
} from '../shared/sharedStyles'
import {StyleSheet, Dimensions, Platform} from 'react-native'
const fullHeight = Dimensions.get('window').height
export const fullWidth = Dimensions.get('window').width

function wp (percentage) {
  const value = (percentage * fullWidth) / 100;

  return Math.round(value);
}

const slideWidth = wp(100);
const itemHorizontalMargin = wp(2);

export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export const whiteTransparent = 'rgba(255, 255, 255, 0.8)'

export const bodyFontSizeSmall = 14
export const closeModalHeaderSize = 21

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
    fontSize: closeModalHeaderSize,
  },
  details: {
    fontFamily: globalFontRegular,
    fontSize: bodyFontSize,
    color: white,
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
    borderRadius: 45/2,
    borderWidth: 1,
    height: 45,
    width: 45,
  },

  // ICON STYLES
  iconLink: {
    backgroundColor: 'transparent',
    color: whiteTransparent,
    fontSize: bodyFontSize,
    paddingRight: globalPaddingTiny,
  },
  iconLinkText: {
    color: whiteTransparent,
    fontFamily: globalFontRegular,
    fontSize: bodyFontSizeSmall,
    paddingRight: globalPaddingTiny,
  },

  // QR CODE STYLES
  qrCodeContainer: {
    backgroundColor: containerDarkColor,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: globalPadding,
    width: fullWidth - 43,
  },
  qrCode: {
    height: 200,
    width: 200,
  },

  // BOTTOM NAV STYLES
  bottomNav: {
    backgroundColor: white,
    borderBottomRightRadius: 20/2,
    borderBottomLeftRadius: 20/2,
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
    fontSize: iconFontSize,
    paddingHorizontal: globalPaddingTiny,
  },
  bottomNavLinkText: {
    color: sectionHeaderColor,
    fontFamily: globalFontMedium,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...TicketWalletStyles, ...overrides})
}

export default {
  createStyles,
  fullWidth,
  itemWidth,
}
