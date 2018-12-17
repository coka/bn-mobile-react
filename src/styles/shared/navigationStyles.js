import {
  primaryColor,
  borderColor,
  white,
  textColor,
  sectionHeaderColor,
  globalFontSemiBold,
  globalFontRegular,
  sectionHeaderFontSize,
  bodyFontSizeSmall,
  globalMargin,
  globalPaddingTiny,
  globalPaddingSmall,
  globalPaddingLarge,
} from './sharedStyles'
import {StyleSheet, Dimensions, Platform} from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

export const bodyFontSize = 18
export const headerFontSize = 16
export const iconLargeFontSize = 38

const NavigationStyles = {
  tabBarIconAccount: {
    height: 20,
    width: 18,
  },
  tabBarIconTicket: {
    height: 18,
    width: 30,
  },
  tabBarIconExplore: {
    height: 22,
    width: 25,
  },
  navigationContainer: {
    backgroundColor: white,
    borderBottomColor: borderColor,
  },
  headerTitle: {
    fontFamily: globalFontSemiBold,
    fontSize: headerFontSize,
    ...Platform.select({
      android: {
        paddingLeft: globalPaddingLarge,
      },
    })
  },
  headerLeftWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLeftTitle: {
    color: primaryColor,
    fontFamily: globalFontRegular,
    fontSize: headerFontSize,
  },
  backButton: {
    color: primaryColor,
    fontSize: iconLargeFontSize,
  },

  // SCROLLING HEADER
  scrollHeaderContainer: {
    backgroundColor: white,
    left: 0,
    overflow: 'hidden',
    paddingVertical: globalPaddingSmall + globalPaddingTiny,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  scrollHeader: {
    marginTop: globalPaddingLarge,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollTitle: {
    color: textColor,
    fontFamily: globalFontSemiBold,
    fontSize: sectionHeaderFontSize,
  },
  scrollSubTitle: {
    color: sectionHeaderColor,
    fontFamily: globalFontRegular,
    fontSize: bodyFontSizeSmall,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...NavigationStyles, ...overrides})
}

export default {
  createStyles,
}
