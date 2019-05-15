import {
  white,
  primaryColor,
  sectionHeaderColor,
  containerDarkColor,
  borderColor,
  textColor,
  globalFontRegular,
  globalFontMedium,
  globalFontSemiBold,
  globalFontSizeSmall,
  globalFontSizeLarger,
  globalFontSizeLargest,
  globalPaddingLarge,
  globalPaddingSmall,
  globalPaddingTiny,
  globalPadding,
  globalMargin,
  globalPaddingMedium,
} from '../shared/sharedStyles'
import {StyleSheet, Dimensions} from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

export const whiteTransparent = 'rgba(255, 255, 255, 0.8)'
export const ticketPriceFontSize = globalFontSizeSmall * 2

const CheckoutStyles = {
  // MAIN BODY STYLES
  mainBody: {
    backgroundColor: 'transparent',
    paddingBottom: globalPaddingLarge + 80,
    paddingHorizontal: 0,
    minHeight: '100%',
    marginTop: fullWidth / 2 - 50,
  },
  checkoutMainBody: {
    marginTop: 100,
  },
  mainBodyContent: {
    backgroundColor: 'white',
    borderTopRightRadius: 30 / 2,
    borderTopLeftRadius: 30 / 2,
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
  headerWrapper: {
    paddingHorizontal: globalPadding,
    paddingVertical: globalPaddingSmall,
  },
  header: {
    backgroundColor: 'transparent',
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeLargest,
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
  soldOutTicketPrice: {
    color: primaryColor,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeSmall,
    paddingRight: globalPadding,
  },
  ticketHeader: {
    color: textColor,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeSmall,
    paddingTop: globalPaddingTiny,
  },
  ticketSubHeader: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeSmall,
  },
  ticketSubHeaderPink: {
    color: primaryColor,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeSmall,
  },

  // ICON STYLES
  iconPayment: {
    borderColor: 'transparent',
    borderRadius: 15 / 2,
    borderWidth: 1,
    height: 50,
    marginRight: globalMargin,
    width: 70,
  },
  iconPaymentSmall: {
    borderColor: 'transparent',
    borderRadius: 15 / 2,
    borderWidth: 1,
    height: 25,
    marginRight: globalMargin,
    width: 40,
  },
  iconCheck: {
    color: primaryColor,
    fontSize: globalFontSizeLarger,
  },
  removeIconDisabled: {
    color: borderColor,
    fontSize: globalFontSizeLarger,
  },
  removeIcon: {
    color: primaryColor,
    fontSize: globalFontSizeLarger,
  },
  addIconDisabled: {
    color: borderColor,
    fontSize: globalFontSizeLarger,
  },
  addIcon: {
    color: primaryColor,
    fontSize: globalFontSizeLarger,
  },

  // BUTTON STYLES
  buttonRounded: {
    backgroundColor: white,
    borderColor: primaryColor,
    borderRadius: 15 / 2,
    borderWidth: 2,
    flex: 1,
    height: 45,
    justifyContent: 'center',
    marginHorizontal: globalMargin,
    marginBottom: globalPaddingLarge,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderColor: primaryColor,
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...CheckoutStyles, ...overrides})
}

export default {
  createStyles,
}
