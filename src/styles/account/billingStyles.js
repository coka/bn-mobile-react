import {
  primaryColor,
  white,
  borderColor,
  textColor,
  globalFontSize,
  globalFontRegular,
  globalPadding,
  globalPaddingSmall,
} from '../shared/sharedStyles'
import { StyleSheet, Dimensions, Platform } from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

const BillingStyles = {
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
    justifyContent: 'flex-start',
  },
  imageWrapper: {
    width: 100,
  },
  billingImageVisa: {
    height: 10,
    width: 30,
  },
  billingImageMC: {
    height: 15,
    width: 25,
  },
  billingImageVenmo: {
    height: 25,
    width: 25,
  },
  billingButtonIcon: {
    color: primaryColor,
    fontSize: globalFontSize,
    paddingRight: globalPaddingSmall,
  },

  // INPUT STYLES
  billingInput: {
    color: textColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSize,
    paddingRight: globalPadding,
  },
  billingInputLast: {
    width: fullWidth,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({ ...BillingStyles, ...overrides })
}

export default {
  createStyles,
}
