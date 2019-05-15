import {
  tertiaryColor,
  white,
  textColor,
  borderColor,
  searchIconColor,
  inputBackgroundColor,
  disabledColor,
  globalFontRegular,
  globalFontSemiBold,
  globalFontSize,
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

const FormStyles = {
  // CONTAINER STYLES
  inputContainer: {
    paddingBottom: globalPadding,
  },
  halfInput: {
    color: textColor,
    backgroundColor: disabledColor,
    borderWidth: 1,
    borderStyle: 'solid',
    fontFamily: globalFontRegular,
    fontSize: globalFontSize,
    height: 50,
    marginBottom: globalPaddingSmall + 5,
    paddingHorizontal: globalPadding,
    width: '50%',
    marginRight: globalPaddingSmall,
  },
  textAreaView: {
    alignContent: 'flex-start',
    backgroundColor: inputBackgroundColor,
    borderColor,
    borderWidth: 1,
    borderStyle: 'solid',
    height: 100,
    width: '100%',
    marginBottom: globalPaddingSmall + 5,
    paddingHorizontal: globalPaddingSmall,
    paddingTop: globalPaddingSmall,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: disabledColor,
    borderColor: 'transparent',
    borderRadius: 7,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: globalMargin,
    marginTop: globalMarginSmall,
    paddingLeft: globalPaddingSmall,
  },

  // TEXTAREA STYLES
  textArea: {
    height: '100%',
    justifyContent: 'center',
    textAlignVertical: 'top',
    color: textColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSize,
  },
  textAreaInput: {
    color: textColor,
    backgroundColor: disabledColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSize,
    flex: 1,
  },

  // INPUT STYLES
  input: {
    color: textColor,
    alignContent: 'center',
    backgroundColor: disabledColor,
    borderColor: 'transparent',
    fontFamily: globalFontRegular,
    fontSize: globalFontSize,
    height: 50,
    marginBottom: globalPaddingMedium,
    paddingHorizontal: globalPadding,
    width: '100%',
  },
  inputLabel: {
    backgroundColor: 'transparent',
    color: textColor,
    fontFamily: globalFontSemiBold,
    fontSize: globalFontSize,
    fontWeight: '500',
    paddingBottom: globalPaddingTiny,
  },
  inputText: {
    color: textColor,
    position: 'absolute',
    textAlign: 'left',
    marginTop: 0,
    paddingLeft: globalPadding,
  },

  // SEARCH STYLES
  searchIcon: {
    height: 15,
    marginHorizontal: globalMarginSmall,
    width: 15,
  },
  searchInput: {
    alignContent: 'center',
    backgroundColor: disabledColor,
    color: textColor,
    flex: 1,
    fontFamily: globalFontRegular,
    fontSize: globalFontSize,
    height: 40,
    marginTop: globalPaddingTiny,
    width: '100%',
  },

  // PLACEHOLDER STYLES
  placeholder: {
    position: 'absolute',
    textAlign: 'left',
    marginTop: -10,
    paddingLeft: globalPadding,
    color: textColor,
    opacity: 0.5,
  },

  // CHECKBOX STYLES
  checkBoxContainer: {
    flex: 1,
    padding: 1,
    justifyContent: 'center',
  },
  checkboxIconContainer: {
    alignItems: 'flex-start',
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkBoxHelpText: {
    color: inputBackgroundColor,
    fontFamily: globalFontRegular,
    fontSize: globalFontSize,
    paddingBottom: globalPaddingTiny,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...FormStyles, ...overrides})
}

export default {
  createStyles,
}
