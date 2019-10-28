import React from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { colors, fonts } from '../styles/shared/sharedStyles'

const Input = (textInputProps) => (
  <TextInput
    style={styles.container}
    autoCapitalize="none"
    placeholderTextColor="#9da3b4"
    selectionColor={colors.brand}
    {...textInputProps}
  />
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 17,
    paddingBottom: 13,
    paddingLeft: 16,
    paddingTop: 18,
  },
})

export default Input
