import React from 'react'
import { Image, StyleSheet, TouchableHighlight, View } from 'react-native'
import { colors } from '../styles/shared/sharedStyles'

const Star = ({ active, onPress }) => (
  <View
    style={[
      styles.container,
      active ? styles.containerActive : styles.containerInactive,
    ]}
  >
    <TouchableHighlight
      style={styles.container}
      onPress={onPress}
      underlayColor={active ? colors.screen : colors.tint}
    >
      {active ? (
        <Image
          style={{ width: 26, height: 26 }}
          source={require('../../assets/star-active.png')}
        />
      ) : (
        <Image
          style={{ width: 28, height: 28 }}
          source={require('../../assets/star-inactive.png')}
        />
      )}
    </TouchableHighlight>
  </View>
)

const size = 38
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: size / 2,
    justifyContent: 'center',
    width: size,
    height: size,
  },
  containerActive: {
    backgroundColor: 'rgb(255, 255, 255)',
  },
  containerInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
})

export default Star
