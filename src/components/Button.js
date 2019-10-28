import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import { colors, fonts } from '../styles/shared/sharedStyles'

const Button = ({ busy, disabled, label, ...touchableHighlightProps }) => (
  <View style={[styles.container, disabled ? styles.containerDisabled : {}]}>
    <TouchableHighlight
      style={[styles.button, busy ? styles.buttonBusy : {}]}
      disabled={disabled}
      underlayColor={colors.tint}
      {...touchableHighlightProps}
    >
      {busy ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableHighlight>
  </View>
)

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
  },
  buttonBusy: {
    backgroundColor: colors.tint,
  },
  container: {
    backgroundColor: colors.brand,
    borderRadius: 5,
    height: 55,
  },
  containerDisabled: {
    backgroundColor: '#d3d3d3',
  },
  label: {
    color: colors.white,
    fontFamily: fonts.semiBold,
    fontSize: 17,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
})

export default Button
