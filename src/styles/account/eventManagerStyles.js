import {
  primaryColor,
  white,
  borderColor,
  sectionHeaderColor,
  iconFontSize,
  bodyFontSize,
  subnavFontSize,
  globalFontRegular,
  globalFontMedium,
  globalPadding,
  globalPaddingSmall,
  globalPaddingTiny,
  globalMargin,
  globalMarginSmall,
} from '../shared/sharedStyles'
import {StyleSheet, Dimensions, Platform} from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

const EventManagerStyles = {
  // ROW STYLES
  cardContainer: {
    alignItems: 'flex-start',
    backgroundColor: white,
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 90,
    marginBottom: globalMargin,
    overflow: 'hidden',
  },

  // IMAGE STYLES
  cardImageWrapper: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },
  cardImage: {
    height: 95,
    width: 95,
  },

  // HEADER WRAPPER STYLES
  textWrapper: {
    flex: 1,
    flexWrap: 'wrap',
    paddingLeft: globalPaddingSmall,
    paddingTop: globalPadding,
  },

  // HEADER STYLES
  sectionHeader: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: bodyFontSize,
    marginBottom: globalMarginSmall,
  },
  cardSubHeader: {
    color: sectionHeaderColor,
    fontFamily: globalFontMedium,
    fontSize: subnavFontSize,
    paddingTop: 2,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...EventManagerStyles, ...overrides})
}

export default {
  createStyles,
}
