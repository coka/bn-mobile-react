import React from 'react'
import {Text, TouchableHighlight} from 'react-native'

function BusyButtonIndicator() {
  return <Text>Loading</Text>
}

export default function BusyButton({
  children,
  isBusy,
  busyContent,
  onPress,
  ...touchableProps
}) {
  return (
    <TouchableHighlight {...touchableProps} onPress={isBusy ? null : onPress}>
      {isBusy ? busyContent || <BusyButtonIndicator /> : children}
    </TouchableHighlight>
  )
}
