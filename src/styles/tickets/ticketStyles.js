import {
  white,
  sectionHeaderColor,
  globalFontRegular,
  bodyFontSize,
  iconFontSize,
  globalPaddingLarge,
  globalPadding,
  globalPaddingSmall,
  globalPaddingTiny,
  globalMargin,
} from '../shared/sharedStyles'
import {StyleSheet, Dimensions, Platform} from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

export const whiteTransparent = 'rgba(255, 255, 255, 0.8)'

export const headerFontSize = 28
export const bodyFontSizeSmall = 13

const TicketStyles = {
  // CONTAINER STYLES
  ticketContainer: {
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    overflow: 'hidden',
    marginTop: globalMargin,
    padding: globalPadding,
  },
  detailsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 145,
  },
  ticketContainerBottom: {
    backgroundColor: white,
    marginTop: -10,
  },
  detailsContainerBottom: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: globalPaddingSmall + globalPaddingTiny,
  },
  ticketHolderWrapper: {
    flex: 1,
    flexWrap: 'wrap',
  },

  // IMAGE BKGD STYLES
  eventImage: {
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    height: 180,
    position: 'absolute',
    width: fullWidth,
  },
  eventImageOverlay: {
    height: 300,
    position: 'absolute',
  },

  // TEXT STYLES
  header: {
    fontFamily: globalFontRegular,
    fontSize: headerFontSize,
    color: white,
    marginBottom: globalPaddingTiny,
  },
  detailsBottomHeader: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: bodyFontSizeSmall,
    letterSpacing: 0.5,
  },
  detailsBottomText: {
    fontSize: bodyFontSize,
    paddingTop: globalPaddingTiny,
  },
  detailsLast: {
    textAlign: 'right',
  },
  ticketHolderHeader: {
    fontSize: bodyFontSize,
    paddingBottom: 2,
  },
  ticketHolderSubheader: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: bodyFontSizeSmall,
    letterSpacing: 0.5,
  },

  // ICON STYLES
  iconTicket: {
    color: white,
    fontSize: iconFontSize,
    marginRight: globalPaddingTiny,
  },
  iconTicketText: {
    color: white,
  },

  // EMPTY STATE STYLES
  emptyStateContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    height: fullHeight - 250,
  },
  emptyStateIcon: {
    height: 150,
    marginBottom: globalMargin,
    width: 120,
  },
  emptyStateText: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: iconFontSize,
    paddingHorizontal: globalPaddingLarge,
    textAlign: 'center',
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...TicketStyles, ...overrides})
}

export default {
  createStyles,
}
