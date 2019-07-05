import {
  globalFontRegular,
  globalFontMedium,
  globalFontSizeTiny,
  globalFontSizeSmall,
  globalFontSize,
  sectionHeaderColor,
  globalPaddingSmall,
  globalPaddingTiny,
} from '../shared/sharedStyles'
import {StyleSheet} from 'react-native'

const OrderHistoryStyles = {
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexBasis: 100,
  },
  icon: {
    color: sectionHeaderColor,
    fontSize: globalFontSizeSmall,
    paddingRight: globalPaddingSmall,
  },
  orderHistoryDate: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeTiny,
  },
  orderHistoryText: {
    fontFamily: globalFontMedium,
    fontSize: globalFontSize,
    paddingTop: globalPaddingTiny,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...OrderHistoryStyles, ...overrides})
}

export default {
  createStyles,
}
