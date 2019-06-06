import {globalPaddingSmall, globalPaddingTiny} from '../shared/sharedStyles'
import {StyleSheet, Dimensions, Platform} from 'react-native'
const fullHeight = Dimensions.get('window').height
const fullWidth = Dimensions.get('window').width

const ImageGridStyles = {
  imageGridContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: globalPaddingSmall,
  },
  image: {
    width: 105,
    height: 105,
    marginLeft: globalPaddingTiny,
    marginRight: globalPaddingTiny,
  },
}

function createStyles(overrides = {}) {
  return StyleSheet.create({...ImageGridStyles, ...overrides})
}

export default {
  createStyles,
}
