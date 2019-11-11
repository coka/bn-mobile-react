import React from 'react'
import { Image, StyleSheet } from 'react-native'

interface Props {
  transferActivityAction: TransferActivityAction
}

const TransferActivityIcon = ({ transferActivityAction }: Props) => {
  switch (transferActivityAction) {
    case 'Accepted':
      return <TransferAcceptedIcon />
    case 'Cancelled':
      return <TransferCancelledIcon />
    case 'Started':
      return <TransferStartedIcon />
  }
}

const acceptedImage = require(`../../assets/transfer-green.png`)
const TransferAcceptedIcon = () => (
  <Image style={styles.icon} source={acceptedImage} />
)

const cancelledImage = require(`../../assets/transfer-red.png`)
const TransferCancelledIcon = () => (
  <Image style={styles.icon} source={cancelledImage} />
)

const startedImage = require(`../../assets/transfer.png`)
const TransferStartedIcon = () => (
  <Image style={styles.icon} source={startedImage} />
)

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
})

export default TransferActivityIcon
