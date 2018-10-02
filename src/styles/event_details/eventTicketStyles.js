import {
  white,
  primaryColor,
  sectionHeaderColor,
  containerDarkColor,
  borderColor,
  textColor,
  bodyFontSize,
  sectionHeaderFontSize,
  globalFontRegular,
  globalFontMedium,
  globalFontSemiBold,
  globalPaddingLarge,
  globalPaddingSmall,
  globalPadding,
  globalMargin,
  globalPaddingMedium,
} from '../shared/sharedStyles'
import {StyleSheet, Dimensions} from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

export const whiteTransparent = 'rgba(255, 255, 255, 0.8)'

export const headerFontSize = 30
export const ticketPriceFontSize = 32
export const quantityIconFontSize = 21


const EventTicketStyles = {
  // MAIN BODY STYLES
  mainBody: {
    backgroundColor: 'transparent',
    paddingLeft: 0,
    paddingRight: 0,
    paddingHorizontal: 0,
    minHeight: '100%',
    marginTop: 240,
  },
  mainBodyContent: {
    backgroundColor: 'white',
    borderTopRightRadius: 30/2,
    borderTopLeftRadius: 30/2,
    height: fullHeight,
    paddingTop: globalPaddingMedium,
    minHeight: '100%',
  },
  spacer: {
    height: 220,
  },

  // CONTAINER STYLES
  fullHeightContainer: {
    backgroundColor: white,
    height: fullHeight,
  },

  // ROW STYLES
  rowContainer: {
    alignItems: 'center',
    backgroundColor: white,
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: globalPadding,
    paddingVertical: globalPadding,
    width: fullWidth,
  },
  rowContainerActive: {
    alignItems: 'center',
    backgroundColor: containerDarkColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: globalPadding,
    paddingVertical: globalPadding,
    width: fullWidth,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  // TEXT STYLES
  header: {
    backgroundColor: 'transparent',
    fontFamily: globalFontSemiBold,
    fontSize: headerFontSize,
    color: textColor,
  },
  quantityPrice: {
    color: textColor,
    fontFamily: globalFontMedium,
    fontSize: ticketPriceFontSize,
    paddingHorizontal: globalPaddingSmall,
  },

  // TICKET SUBNAV STYLES
  ticketPrice: {
    color: primaryColor,
    fontFamily: globalFontSemiBold,
    fontSize: ticketPriceFontSize,
    paddingRight: globalPadding,
  },
  ticketHeader: {
    color: textColor,
    fontFamily: globalFontSemiBold,
    fontSize: bodyFontSize,
    paddingTop: globalPaddingSmall,
  },
  ticketSubHeader: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: bodyFontSize,
  },

  // ICON STYLES
  iconPayment: {
    borderRadius: 15/2,
    borderWidth: 1,
    height: 50,
    marginRight: globalMargin,
    width: 70,
  },
  iconCheck: {
    color: primaryColor,
    fontSize: sectionHeaderFontSize,
  },
  removeIcon: {
    color: borderColor,
    fontSize: quantityIconFontSize,
  },
  addIcon: {
    color: primaryColor,
    fontSize: quantityIconFontSize,
  },

  // BUTTON STYLES
  buttonRounded: {
    backgroundColor: white,
    borderColor: primaryColor,
    borderRadius: 15/2,
    borderWidth: 2,
    flex: 1,
    height: 45,
    justifyContent: 'center',
    marginHorizontal: globalMargin,
    marginBottom: globalPaddingLarge,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...EventTicketStyles, ...overrides})
}

export default {
  createStyles,
}
