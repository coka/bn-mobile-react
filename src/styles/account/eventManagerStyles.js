import {
  primaryColor,
  white,
  borderColor,
  sectionHeaderColor,
  globalFontRegular,
  globalFontMedium,
  globalFontSemiBold,
  globalFontSizeSmaller,
  globalFontSizeSmall,
  globalFontSize,
  globalPadding,
  globalPaddingSmall,
  globalMargin,
  globalMarginSmall,
} from '../shared/sharedStyles'
import { StyleSheet } from 'react-native'

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

  redeemedStats: {
    paddingTop: globalPadding,
    fontSize: globalFontSize,
  },

  // HEADER STYLES
  sectionHeader: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeSmall,
    marginBottom: globalMarginSmall,
  },
  cardSubHeader: {
    color: sectionHeaderColor,
    fontFamily: globalFontMedium,
    fontSize: globalFontSizeSmaller,
    paddingTop: 2,
  },

  // BUTTONS
  buttonScanTicket: {
    alignItems: 'center',
    backgroundColor: white,
    borderColor,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
  },
  buttonScanTicketText: {
    color: primaryColor,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSize,
  },
  buttonScanIcon: {
    color: primaryColor,
    fontSize: globalFontSize,
    marginRight: globalMarginSmall,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({ ...EventManagerStyles, ...overrides })
}

export default {
  createStyles,
}
