import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import SharedStyles from '../styles/shared/sharedStyles'

const styles = SharedStyles.createStyles()

export default function EventsChangeLocation() {
  return (
    <View style={styles.container}>
      <Text>Change Event City</Text>
    </View>
  )
}
