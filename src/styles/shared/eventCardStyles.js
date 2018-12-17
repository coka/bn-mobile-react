import {
  white,
  primaryColor,
  textColor,
  bodyFontSize,
  iconFontSize,
  globalFontRegular,
  globalFontSemiBold,
  globalPadding,
  globalPaddingSmall,
  globalPaddingTiny,
} from '../shared/sharedStyles'
import {StyleSheet, Dimensions, Platform} from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

export const whiteTransparent = 'rgba(255, 255, 255, 0.3)'

export const headerFontSize = 38
export const sectionHeaderFontSize = 18

const EventCardStyles = {
  // CONTAINER STYLES
  detailsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 180,
    padding: globalPadding,
  },
  detailsContainerBottom: {
    paddingBottom: globalPadding,
  },
  sectionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // TEXT STYLES
  header: {
    fontFamily: globalFontSemiBold,
    fontSize: sectionHeaderFontSize,
    color: textColor,
    paddingTop: globalPaddingSmall,
  },
  details: {
    fontFamily: globalFontRegular,
    fontSize: bodyFontSize,
    color: textColor,
    paddingTop: 2,
  },

  // ICON STYLES
  iconLinkCircleContainerSmall: {
    backgroundColor: whiteTransparent,
    borderRadius: 100/2,
    height: 28,
    padding: globalPaddingTiny,
    width: 28,
  },
  iconLinkCircleSmall: {
    color: white,
    fontSize: iconFontSize,
  },
  iconLinkCircleContainerSmallActive: {
    backgroundColor: white,
    borderRadius: 100/2,
    height: 28,
    padding: globalPaddingTiny,
    width: 28,
  },
  iconLinkCircleSmallActive: {
    color: primaryColor,
    fontSize: iconFontSize,
  },

  // IMAGE BKGD STYLES
  eventImage: {
    height: 180,
    position: 'absolute',
    width: fullWidth - 43,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...EventCardStyles, ...overrides})
}

export default {
  createStyles,
}
