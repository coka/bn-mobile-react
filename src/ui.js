import React from 'react'
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native'

export function KeyboardDismisser({ children }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View>{children}</View>
    </TouchableWithoutFeedback>
  )
}
