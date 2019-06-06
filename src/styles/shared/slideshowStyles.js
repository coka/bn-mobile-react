import {
  white,
  globalFontSemiBold,
  globalFontRegular,
  globalFontSizeSmall,
  globalFontSizeLargest,
  globalPaddingJumbo,
  globalPaddingLarge,
  globalPadding,
  globalPaddingSmall,
  globalPaddingTiny,
  globalMargin,
} from '../shared/sharedStyles'
import {StyleSheet, Dimensions, Platform} from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

export const whiteTransparent = 'rgba(225, 225, 225, 0.8)'

export const slideShowArrowFontSize = globalFontSizeSmall * 2

const SlideShowStyles = {
  // CONTAINER STYLES
  slideshowContainer: {
    marginBottom: globalMargin,
  },
  detailsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 300,
    padding: globalPadding,
  },
  sectionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionMiddle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: globalPaddingJumbo,
  },

  // TEXT STYLES
  header: {
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeLargest,
    color: white,
    marginTop: globalPaddingTiny,
  },
  details: {
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeSmall,
    color: whiteTransparent,
  },

  // IMAGE STYLES
  slideShowImage: {
    width: fullWidth - 43,
    height: 300,
    position: 'absolute',
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...SlideShowStyles, ...overrides})
}

export default {
  createStyles,
}
