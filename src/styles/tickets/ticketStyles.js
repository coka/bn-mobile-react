import {
  isSmallDevice,
  white,
  sectionHeaderColor,
  globalFontRegular,
  globalFontSizeTiny,
  globalFontSizeSmall,
  globalFontSize,
  globalFontSizeLargest,
  globalPaddingLarge,
  globalPadding,
  globalPaddingSmall,
  globalPaddingTiny,
  globalMargin,
  globalMarginSmall,
} from '../shared/sharedStyles'
import { StyleSheet, Dimensions, Platform } from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

export const whiteTransparent = 'rgba(255, 255, 255, 0.8)'

const TicketStyles = {
  // CONTAINER STYLES
  ticketContainer: {
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    overflow: 'hidden',
    marginTop: isSmallDevice ? globalMarginSmall : globalMargin,
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
    color: white,
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeLargest,
    marginBottom: globalPaddingTiny,
    paddingRight: globalPaddingSmall,
  },
  detailsBottomHeader: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeTiny,
    letterSpacing: 0.5,
  },
  detailsBottomText: {
    fontSize: globalFontSizeTiny,
    paddingTop: globalPaddingTiny,
  },
  detailsLast: {
    textAlign: 'right',
  },
  ticketHolderHeader: {
    fontSize: globalFontSizeSmall,
    paddingBottom: 2,
  },
  ticketHolderSubheader: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeTiny,
    letterSpacing: 0.5,
  },

  // ICON STYLES
  iconTicket: {
    color: white,
    fontSize: globalFontSize,
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
    height: fullHeight - 300,
  },
  emptyStateIcon: {
    height: 150,
    marginBottom: globalMargin,
    width: 120,
  },
  emptyStateText: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSize,
    paddingHorizontal: globalPaddingLarge,
    textAlign: 'center',
  },
  noTicketsPromoContainer: {
    marginTop: -100,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({ ...TicketStyles, ...overrides })
}

export default {
  createStyles,
}
