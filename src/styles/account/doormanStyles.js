import {
  textColor,
  sectionHeaderColor,
  white,
  borderColor,
  disabledColor,
  bodyFontSize,
  subnavFontSize,
  globalFontRegular,
  globalFontMedium,
  globalFontSemiBold,
  globalPaddingMedium,
  globalPadding,
  globalPaddingSmall,
  globalPaddingTiny,
  globalMargin,
  globalMarginSmall,
} from '../shared/sharedStyles'
import {StyleSheet, Dimensions, Platform} from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

export const whiteTransparent = 'rgba(255, 255, 255, 0.8)'
export const badgePrimary = '#1E1E1E'
export const badgeSuccess = '#47C68A'
export const badgeAlarm = '#FE1313'


export const sectionHeaderFontSize = 24
export const bodyFontSizeSmall = 15

const DoormanStyles = {
  // MAIN BODY STYLES
  mainBody: {
    backgroundColor: 'transparent',
    paddingLeft: 0,
    paddingRight: 0,
    paddingHorizontal: 0,
    minHeight: '100%',
    marginTop: 240,
  },
  checkoutMainBody: {
    marginTop: 100,
  },
  mainBodyContent: {
    backgroundColor: 'white',
    borderTopRightRadius: 30/2,
    borderTopLeftRadius: 30/2,
    height: fullHeight,
    paddingTop: globalPaddingSmall,
    minHeight: '100%',
  },
  spacer: {
    height: 200,
  },

  // SEARCH STYLES
  searchContainer: {
    backgroundColor: disabledColor,
    borderColor: 'transparent',
    borderRadius: 7,
    borderWidth: 1,
    height: 40,
    marginVertical: globalMarginSmall,
    padding: globalPaddingSmall,
  },
  searchInput: {
    backgroundColor: disabledColor,
    color: textColor,
    fontFamily: globalFontRegular,
    fontSize: bodyFontSize,
    marginTop: globalPaddingTiny,
    width: '100%',
  },

  // TEXT STYLES
  sectionHeader: {
    backgroundColor: 'transparent',
    color: sectionHeaderColor,
    fontFamily: globalFontSemiBold,
    fontSize: sectionHeaderFontSize,
  },
  bodyText: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: bodyFontSizeSmall,
    paddingTop: globalPaddingTiny,
  },

  // ROW STYLES
  rowContainer: {
    backgroundColor: white,
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    paddingHorizontal: globalPadding,
    paddingVertical: globalPaddingSmall,
    width: fullWidth,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // BADGE STYLES
  ticketStatusBadgeWrapper: {
    backgroundColor: badgePrimary,
    borderColor: 'transparent',
    borderWidth: 1,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginLeft: globalMargin,
  },
  ticketPurchasedBadgeWrapper: {
    backgroundColor: badgeSuccess,
  },
  ticketStatusBadge: {
    color: white,
    fontFamily: globalFontMedium,
    fontSize: subnavFontSize,
    letterSpacing: 0.5,
    padding: globalPaddingTiny - 2,
    textTransform: 'uppercase',
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...DoormanStyles, ...overrides})
}

export default {
  createStyles,
}
