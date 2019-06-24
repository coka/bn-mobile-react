import {
  sectionHeaderColor,
  white,
  borderColor,
  globalFontRegular,
  globalFontSizeSmall,
  globalPadding,
  globalPaddingSmall,
  globalMarginSmall,
} from '../shared/sharedStyles'
import {StyleSheet, Dimensions} from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

export const whiteTransparent = 'rgba(255, 255, 255, 0.8)'

const NotificationStyles = {
  notificationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: globalPadding,
  },
  notificationRow: {
    alignItems: 'center',
    backgroundColor: white,
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: globalPadding,
    paddingVertical: globalPaddingSmall,
    width: fullWidth,
  },
  sectionHeader: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeSmall,
    marginBottom: globalMarginSmall,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...NotificationStyles, ...overrides})
}

export default {
  createStyles,
}
