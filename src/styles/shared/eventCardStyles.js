import {
  white,
  primaryColor,
  textColor,
  globalFontRegular,
  globalFontSemiBold,
  globalFontSizeSmall,
  globalFontSize,
  globalPadding,
  globalPaddingSmall,
  globalPaddingTiny,
} from '../shared/sharedStyles'
import { StyleSheet, Dimensions, Platform } from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

export const whiteTransparent = 'rgba(255, 255, 255, 0.3)'

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
    fontSize: globalFontSize,
    color: textColor,
    paddingTop: globalPaddingSmall,
  },
  details: {
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeSmall,
    color: textColor,
    paddingTop: 2,
  },

  // ICON STYLES
  iconLinkCircleContainerSmall: {
    backgroundColor: whiteTransparent,
    borderRadius: 100 / 2,
    height: 28,
    paddingLeft: 1,
    paddingTop: 1,
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLinkCircleSmall: {
    color: white,
    fontSize: globalFontSize,
  },
  iconLinkCircleContainerSmallActive: {
    backgroundColor: white,
    borderRadius: 100 / 2,
    height: 28,
    paddingLeft: 1,
    paddingTop: 1,
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLinkCircleSmallActive: {
    color: primaryColor,
    fontSize: globalFontSize,
  },

  // IMAGE BKGD STYLES
  eventImage: {
    height: 180,
    position: 'absolute',
    width: fullWidth - 43,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({ ...EventCardStyles, ...overrides })
}

export default {
  createStyles,
}
