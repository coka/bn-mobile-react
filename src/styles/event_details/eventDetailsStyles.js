import {
  primaryColor,
  white,
  sectionHeaderColor,
  borderColor,
  textColor,
  disabledHeaderColor,
  globalFontRegular,
  globalFontMedium,
  globalFontSemiBold,
  globalFontBold,
  globalFontSizeTiny,
  globalFontSizeSmaller,
  globalFontSizeSmall,
  globalFontSize,
  globalFontSizeLarge,
  globalFontSizeLargest,
  globalPaddingLarger,
  globalPaddingLarge,
  globalPaddingMedium,
  globalPadding,
  globalPaddingSmall,
  globalPaddingTiny,
  globalMargin,
  disabledColor,
} from '../shared/sharedStyles'
import { StyleSheet, Dimensions, Platform } from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

export const whiteTransparent = 'rgba(255, 255, 255, 0.8)'
export const iconLargeFontSize = globalFontSizeLargest * 2

const EventDetailsStyles = {
  // VIDEO BKGD STYLES
  videoBkgd: {
    height: fullWidth / 2,
    position: 'absolute',
    top: 0,
    width: fullWidth,
    zIndex: -10,
  },

  // CLOSE ICON STYLES
  linkContainer: {
    height: 85,
    width: 85,
  },
  backArrowWrapper: {
    position: 'absolute',
    top: 0,
    padding: globalPadding + globalPaddingTiny,
    paddingTop: globalPaddingLarge,
    zIndex: 0,
  },
  backArrowCircleContainer: {
    backgroundColor: disabledHeaderColor,
    borderRadius: 100 / 2,
    height: 45,
    padding: globalPaddingSmall,
    width: 45,
  },
  backArrow: {
    color: white,
    fontSize: globalFontSizeLarge,
  },

  // MAIN BODY STYLES
  mainBody: {
    backgroundColor: 'transparent',
    paddingBottom: globalPaddingLarge,
    paddingHorizontal: 0,
    marginTop: fullWidth / 2 - 50,
  },
  mainBodyContent: {
    backgroundColor: 'white',
    borderTopRightRadius: 30 / 2,
    borderTopLeftRadius: 30 / 2,
    paddingHorizontal: globalPadding,
    paddingTop: globalPaddingMedium,
    position: 'relative',
    zIndex: 10,
  },
  spacerFooter: {
    height: 100,
  },

  // CONTAINER STYLES
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    width: fullWidth,
  },
  sectionBottom: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -45,
    paddingBottom: globalPaddingLarge,
  },
  iconSectionHeaderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: globalPadding,
  },
  youtubeVideoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  priceHeaderWrapper: {
    backgroundColor: white,
    borderTopColor: borderColor,
    borderStyle: 'solid',
    borderTopWidth: 1,
    paddingVertical: globalPadding - globalPaddingTiny,
  },

  // TEXT STYLES
  descriptionHeader: {
    color: textColor,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeLarge,
  },
  descriptionSubHeader: {
    color: sectionHeaderColor,
    fontFamily: globalFontMedium,
    fontSize: globalFontSize,
    paddingBottom: globalPaddingTiny,
    paddingTop: globalPaddingTiny,
  },
  header: {
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeLarge,
    color: white,
    marginTop: globalPaddingTiny,
  },
  sectionHeader: {
    color: textColor,
    fontFamily: globalFontBold,
    fontSize: globalFontSize,
    marginVertical: globalMargin,
  },
  bodyText: {
    backgroundColor: 'transparent',
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSizeSmall,
    paddingBottom: globalPaddingSmall,
    paddingLeft: globalPadding + globalPaddingTiny,
  },
  linkText: {
    backgroundColor: 'transparent',
    color: primaryColor,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeSmall,
    paddingLeft: globalPadding + globalPaddingTiny,
  },
  iconSectionHeader: {
    color: textColor,
    fontFamily: globalFontBold,
    fontSize: globalFontSize,
  },
  priceHeader: {
    color: textColor,
    fontFamily: globalFontBold,
    fontSize: globalFontSize,
    textAlign: 'center',
  },
  checkInSwipeText: {
    color: white,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeSmall,
    textAlign: 'left',
  },
  checkInSwipeContainer: {
    alignItems: 'center',
    backgroundColor: primaryColor,
    flex: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'flex-start',
    paddingLeft: globalPadding,
  },
  disabledCheckInSwipeText: {
    color: disabledHeaderColor,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeSmall,
    textAlign: 'left',
  },
  disabledCheckInSwipeContainer: {
    alignItems: 'center',
    backgroundColor: disabledColor,
    flex: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'flex-start',
    paddingLeft: globalPadding,
  },

  // EVENT DETAILS/DESCRIPTION STYLES
  eventDetailsContainer: {
    flexDirection: 'row',
    paddingVertical: globalPaddingMedium - globalPaddingTiny,
  },
  eventDescriptionContainer: {
    paddingVertical: globalPaddingSmall,
    // borderTopColor: borderColor,
    // borderBottomColor: borderColor,
    // borderStyle: 'solid',
    // borderTopWidth: 1,
    // borderBottomWidth: 1, // Removing until the Avatar section is added
  },
  eventDescriptionHeaderWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  // AVATAR STYLES
  avatarContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  avatar: {
    borderColor: white,
    borderRadius: 45 / 2,
    borderWidth: 1,
    height: 45,
    marginHorizontal: globalPaddingTiny,
    width: 45,
  },
  attendeeContainer: {
    borderColor,
    borderRadius: 45 / 2,
    borderWidth: 1,
    height: 45,
    marginHorizontal: globalPaddingTiny,
    padding: globalPaddingTiny,
    width: 45,
  },
  attendeeNumber: {
    color: primaryColor,
    fontFamily: globalFontBold,
    fontSize: globalFontSizeTiny,
    letterSpacing: 1,
    paddingTop: globalPaddingSmall,
    textAlign: 'center',
  },

  // ICON STYLES
  iconPlayLink: {
    color: whiteTransparent,
    fontSize: iconLargeFontSize,
    marginBottom: globalMargin,
  },
  iconYoutube: {
    width: 20,
    height: 15,
    marginRight: globalPaddingSmall,
  },
  iconInstagram: {
    width: 20,
    height: 20,
    marginRight: globalPaddingSmall,
  },
  iconSpotify: {
    width: 20,
    height: 20,
    marginRight: globalPaddingSmall,
  },
  iconEventDescription: {
    color: sectionHeaderColor,
    fontSize: globalFontSizeSmall,
    paddingRight: globalPaddingSmall,
  },

  // BUTTON STYLES
  buttonRounded: {
    alignItems: 'center',
    backgroundColor: white,
    borderColor,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
  },
  buttonRoundedActive: {
    alignItems: 'center',
    backgroundColor: primaryColor,
    borderColor: primaryColor,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
  },
  buttonRoundedText: {
    color: sectionHeaderColor,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeSmall,
    textAlign: 'center',
  },
  buttonRoundedActiveText: {
    color: white,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSizeSmall,
    textAlign: 'center',
  },
  buttonRoundedIcon: {
    color: sectionHeaderColor,
    fontSize: globalFontSizeSmall,
    paddingRight: globalPaddingTiny,
  },
  buttonRoundedActiveIcon: {
    color: white,
    fontSize: globalFontSizeSmall,
    paddingRight: globalPaddingTiny,
  },
  buttonRoundedSecondary: {
    backgroundColor: primaryColor,
    borderColor,
    borderRadius: 55 / 2,
    borderWidth: 1,
    flex: 1,
    height: 55,
    justifyContent: 'center',
    marginHorizontal: globalMargin,
    marginBottom: globalPaddingLarge,
  },

  // CALENDAR STYLES
  calendarWrapper: {
    backgroundColor: textColor,
    borderRadius: 4,
    height: 50,
    padding: globalPaddingTiny,
    width: 50,
  },
  calendarMonth: {
    color: white,
    fontFamily: globalFontMedium,
    fontSize: globalFontSizeSmaller,
    textAlign: 'center',
  },
  calendarDate: {
    color: white,
    fontFamily: globalFontMedium,
    fontSize: globalFontSizeLarge,
    textAlign: 'center',
  },

  // IMAGE PLACEHOLDER STYLES
  imagePlaceholderContainer: {
    height: 100,
    paddingVertical: globalPadding,
  },
  imagePlaceholder: {
    height: 100,
    width: fullWidth - 40,
    position: 'absolute',
  },

  // SLIDER STYLES
  sliderArrowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: globalPadding,
  },
  slideShowIconLinkLeft: {
    color: textColor,
    fontSize: globalFontSizeLargest,
    marginLeft: -23,
  },
  slideShowIconLinkRight: {
    color: textColor,
    fontSize: globalFontSizeLargest,
    marginRight: -23,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({ ...EventDetailsStyles, ...overrides })
}

export default {
  createStyles,
}
