import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { colors, fonts } from '../styles/shared/sharedStyles'

const Link = ({ children, ...textProps }) => (
  <Text style={styles.text} {...textProps}>
    {children}
  </Text>
)

const styles = StyleSheet.create({
  text: {
    color: colors.brand,
    fontFamily: fonts.semiBold,
  },
})

export default Link
