import { DateTime } from 'luxon'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { fonts } from '../styles/shared/sharedStyles'
import TransferActivityIcon from './TransferActivityIcon'

interface Props {
  activity: TransferActivity
  position: number
  totalNumberOfActivities: number
}

const TransferActivityEvent = ({
  activity,
  position,
  totalNumberOfActivities,
}: Props) => {
  // TODO: These should be decided by the parent component.
  const additionalTopMargin = position > 0 ? 30 : 0
  const label = getLabelForTransferActivityAction(activity.action)
  const shouldDisplayConnection =
    totalNumberOfActivities > 1 && position < totalNumberOfActivities - 1

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: additionalTopMargin,
        },
      ]}
    >
      <TransferActivityIcon transferActivityAction={activity.action} />
      {shouldDisplayConnection && <Connection />}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.info}>
          {activity.ticket_ids.length}{' '}
          {activity.ticket_ids.length > 1 ? 'tickets' : 'ticket'} to{' '}
          {activity.destination_addresses}
        </Text>
        <Text style={styles.date}>
          {DateTime.fromISO(activity.occurred_at).toFormat('EEE, MMMM d, y t')}
        </Text>
      </View>
    </View>
  )
}

const connectionImage = require('../../assets/transfer-dashes.png')
const Connection = () => (
  <Image style={styles.connection} source={connectionImage} />
)

const getLabelForTransferActivityAction = (
  transferActivityAction: TransferActivityAction
): string => {
  switch (transferActivityAction) {
    case 'Accepted':
      return 'Transfer Completed'
    case 'Cancelled':
      return 'Transfer Cancelled'
    case 'Started':
      return 'Transfer Initiated'
  }
}

const styles = StyleSheet.create({
  connection: {
    position: 'absolute',
    height: 46,
    left: 10,
    top: 27.5,
    width: 1,
  },
  container: {
    flexDirection: 'row',
  },
  date: {
    color: '#9DA3B4',
    fontFamily: fonts.regular,
    fontSize: 10,
    marginTop: 6,
  },
  info: {
    color: '#9DA3B4',
    fontFamily: fonts.medium,
    fontSize: 12,
    marginTop: 2,
  },
  textContainer: {
    marginLeft: 10,
  },
  title: {
    color: '#3C383F',
    fontFamily: fonts.semiBold,
    fontSize: 14,
  },
})

export default TransferActivityEvent
