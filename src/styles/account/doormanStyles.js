import {
  textColor,
  sectionHeaderColor,
  white,
  borderColor,
  disabledColor,
  globalFontRegular,
  globalFontMedium,
  globalFontSemiBold,
  globalFontSizeSmaller,
  globalFontSizeSmall,
  globalFontSizeLarge,
  globalPadding,
  globalPaddingSmall,
  globalPaddingTiny,
  globalMarginSmall,
} from '../shared/sharedStyles'
import { StyleSheet, Dimensions } from 'react-native'
const fullWidth = Dimensions.get('window').width

export const whiteTransparent = 'rgba(255, 255, 255, 0.8)'
export const badgePrimary = '#1E1E1E'
export const badgeSuccess = '#47C68A'
export const badgeAlarm = '#FE1313'

const DoormanStyles = {
  // MAIN BODY STYLES
  mainBody: {
    backgroundColor: 'white',
    paddingLeft: 0,
    paddingRight: 0,
    paddingHorizontal: 0,
  },
  mainBodyContent: {
    backgroundColor: 'white',
    minHeight: '100%',
    paddingTop: globalPaddingSmall,
  },
  spacer: {
    height: 20,
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
    fontSize: globalFontSizeSmall,
    marginTop: globalPaddingTiny,
    width: '100%',
  },

  // TEXT STYLES
  sectionHeader: {
    backgroundColor: 'transparent',
    color: sectionHeaderColor,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeLarge,
  },
  bodyText: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeSmaller,
    paddingTop: globalPaddingTiny,
  },

  // ROW STYLES
  rowContainer: {
    backgroundColor: white,
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    paddingHorizontal: globalPadding,
    paddingVertical: globalPaddingSmall,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexRowGuestList: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: fullWidth / 1.8,
  },

  // BADGE STYLES
  ticketStatusBadgeWrapper: {
    backgroundColor: badgePrimary,
    borderColor: 'transparent',
    borderWidth: 1,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginLeft: globalMarginSmall,
  },
  ticketPurchasedBadgeWrapper: {
    backgroundColor: badgeSuccess,
  },
  ticketStatusBadge: {
    color: white,
    fontFamily: globalFontMedium,
    fontSize: globalFontSizeSmaller,
    letterSpacing: 0.5,
    padding: globalPaddingTiny - 2,
    textTransform: 'uppercase',
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({ ...DoormanStyles, ...overrides })
}

export default {
  createStyles,
}
