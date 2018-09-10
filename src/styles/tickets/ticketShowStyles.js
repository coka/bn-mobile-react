import {
  primaryColor,
  white,
  containerDarkColor,
  sectionHeaderColor,
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

export const bodyFontSize = 16
export const bodyFontSizeSmall = 14
export const iconFontSize = 18
export const closeModalHeaderSize = 21

const TicketShowStyles = {
  modalContainer: {
    flexDirection: 'column',
    height: fullHeight,
    justifyContent: 'center',
    paddingHorizontal: globalPadding,
  },
  modalBkgdImage: {
    height: fullHeight,
    width: fullWidth,
    position: 'absolute',
  },
  closeModalContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: globalPaddingLarge,
  },
  closeModalHeader: {
    color: white,
    fontFamily: globalFontMedium,
    fontSize: closeModalHeaderSize,
  },
  slideWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  details: {
    fontFamily: globalFontRegular,
    fontSize: bodyFontSize,
    color: white,
    paddingVertical: globalPaddingTiny,
  },
  detailsContainerBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: globalPaddingSmall + globalPaddingTiny,
    paddingVertical: globalPaddingSmall,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingRight: globalPaddingSmall,
  },
  avatar: {
    borderColor: white,
    borderRadius: 45/2,
    borderWidth: 1,
    height: 45,
    width: 45,
  },
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
  return StyleSheet.create({...TicketShowStyles, ...overrides})
}

export default {
  createStyles,
  fullWidth,
  itemWidth,
}
