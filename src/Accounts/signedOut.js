import React from 'react'
import {Text, View} from 'react-native'
import SharedStyles from '../styles/shared/sharedStyles'

const styles = SharedStyles.createStyles()

export default function SignedOut() {
  return (
    <View style={styles.container}>
      <Text>You&apos;re signed out</Text>
      <Text>(Will probably just be a redirect Home with a flash message)</Text>
    </View>
  )
}
