import { DateTime } from 'luxon'
import React from 'react'
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import { Image as CachedImage } from 'react-native-expo-image-cache'
import Icon from 'react-native-vector-icons/MaterialIcons'
import imageOverlay from '../../assets/event-img-overlay.png'
import { optimizeCloudinaryImage } from '../cloudinary'
import SharedStyles, { colors, fonts } from '../styles/shared/sharedStyles'
import TicketStyles from '../styles/tickets/ticketStyles'
import TicketWalletStyles from '../styles/tickets/ticketWalletStyles'

interface Props {
  event: Event
  transferActivities: Array<TransferActivity>
}

interface Event {
  formattedDate: string
  formattedStart: string
  name: string
  promo_image_url: string
  venue: Venue
}

interface Venue {
  address: string
  city: string
  country: string
  name: string
  postal_code: string
}

interface TransferActivity {
  accepted_by: User
  action: 'Accepted' | 'Cancelled' | 'Started'
  destination_addresses: string
  initiated_by: User
  occurred_at: string
  ticket_ids: Array<string>
  transfer_id: string
}

interface User {
  id: string
  full_name: string
  first_name: string
  last_name: string
}

const sharedStyles = SharedStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()
const ticketWalletStyles = TicketWalletStyles.createStyles()

// TODO: Copied from src/Tickets/Ticket.js, and modified. Move to a separate
//       file.
const openVenueDirections = (venue: Venue) => {
  const encodedAddress = encodeURIComponent(
    `${venue.address} ${venue.postal_code}, ${venue.city}, ${venue.country}`
  )
  Linking.openURL(`http://maps.apple.com/?daddr=${encodedAddress}`)
}

// TODO
const handleCancelTransferTicket = () => {
  console.log('Cancelling transfer...')
}

const TransferTicket = ({ event, transferActivities }: Props) => (
  <View>
    <View style={ticketStyles.ticketContainer}>
      <View style={ticketWalletStyles.eventImageWrapper}>
        <CachedImage
          style={ticketWalletStyles.eventImage}
          uri={optimizeCloudinaryImage(event.promo_image_url)}
        />
        <Image style={ticketStyles.eventImageOverlay} source={imageOverlay} />
      </View>
      <View style={ticketStyles.detailsContainer}>
        <View>
          <View style={sharedStyles.iconLinkContainer}>
            <Image
              style={sharedStyles.iconImage}
              source={require('../../assets/heart-white.png')}
            />
          </View>
        </View>
        <View>
          <Text numberOfLines={1} style={ticketStyles.header}>
            {event.name}
          </Text>
          <Text numberOfLines={1} style={ticketWalletStyles.details}>
            {event.formattedDate} &bull; {event.formattedStart} &bull;{' '}
            {event.venue.name}
          </Text>
          <TouchableHighlight onPress={() => openVenueDirections(event.venue)}>
            <View style={sharedStyles.iconLinkContainer}>
              <Text style={ticketWalletStyles.iconLinkText}>
                GET DIRECTIONS
              </Text>
              <Icon style={ticketWalletStyles.iconLink} name="call-made" />
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </View>
    <View style={ticketWalletStyles.ticketContainerBottom}>
      <View style={[sharedStyles.flexRowFlexStartCenter]}>
        <View>
          <Text style={ticketStyles.ticketHolderHeader}>
            {transferActivities[0].initiated_by.full_name}
          </Text>
          <Text style={ticketStyles.ticketHolderSubheader}>
            {/* TODO: Display the correct ticket data (?) here. */}
            GENERAL ADMISSION
          </Text>
        </View>
      </View>
    </View>
    <ScrollView
      style={styles.activityContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.activityGroup}>
        {transferActivities.map((activity, index) => (
          <Stuff
            key={`${activity.transfer_id}-${index}`}
            activity={activity}
            position={index}
            totalNumberOfActivities={transferActivities.length}
          />
        ))}
      </View>
    </ScrollView>
    <View style={ticketWalletStyles.bottomNav}>
      <View>
        <TouchableHighlight
          underlayColor="rgba(0, 0, 0, 0)"
          onPress={handleCancelTransferTicket}
        >
          <View style={ticketWalletStyles.bottomNavLinkContainer}>
            <Text style={ticketWalletStyles.bottomNavLinkText}>
              CANCEL TRANSFER
            </Text>
            <Icon style={ticketWalletStyles.bottomNavIcon} name="launch" />
          </View>
        </TouchableHighlight>
      </View>
    </View>
  </View>
)

interface StuffProps {
  activity: TransferActivity
  h1?: string
  h2?: string
  h3?: string
  position: number
  totalNumberOfActivities: number
}

const Stuff = ({ activity, position, totalNumberOfActivities }: StuffProps) => {
  const additionalTopMargin = position > 0 ? 30 : 0
  const label = getLabelForActivity(activity)
  const shouldDisplayConnection =
    totalNumberOfActivities > 1 && position < totalNumberOfActivities - 1
  const TransferIcon = getTransferIconForActivity(activity)

  return (
    <View
      style={[
        styles.stuffContainer,
        {
          marginTop: additionalTopMargin,
        },
      ]}
    >
      <TransferIcon />
      {shouldDisplayConnection && (
        <Image
          style={{
            width: 1,
            height: 46,
            position: 'absolute',
            left: 10,
            top: 27.5,
          }}
          source={require('../../assets/transfer-dashes.png')}
        />
      )}
      <View style={styles.stuffText}>
        <Text style={styles.h1}>{label}</Text>
        <Text style={styles.h2}>
          {activity.ticket_ids.length}{' '}
          {activity.ticket_ids.length > 1 ? 'tickets' : 'ticket'} to{' '}
          {activity.destination_addresses}
        </Text>
        <Text style={styles.h3}>
          {DateTime.fromISO(activity.occurred_at).toFormat('EEE, MMMM d, y t')}
        </Text>
      </View>
    </View>
  )
}

const getLabelForActivity = (activity: TransferActivity): string => {
  switch (activity.action) {
    case 'Accepted':
      return 'Transfer Completed'
    case 'Cancelled':
      return 'Transfer Cancelled'
    case 'Started':
      return 'Transfer Initiated'
  }
}

const getTransferIconForActivity = (
  activity: TransferActivity
): (() => JSX.Element) => {
  switch (activity.action) {
    case 'Accepted':
      return TransferAcceptedIcon
    case 'Cancelled':
      return TransferCancelledIcon
    case 'Started':
      return TransferStartedIcon
  }
}

const TransferAcceptedIcon = () => (
  <Image
    style={{ width: 20, height: 20 }}
    source={require(`../../assets/transfer-green.png`)}
  />
)

const TransferCancelledIcon = () => (
  <Image
    style={{ width: 20, height: 20 }}
    source={require(`../../assets/transfer-red.png`)}
  />
)

const TransferStartedIcon = () => (
  <Image
    style={{ width: 20, height: 20 }}
    source={require(`../../assets/transfer.png`)}
  />
)

const styles = StyleSheet.create({
  activityContainer: {
    backgroundColor: '#f7f7f7',
    height: 272,
    marginRight: 19, // TODO: Dirty hack to keep it within the parent.
  },
  activityGroup: {
    backgroundColor: colors.white,
    borderRadius: 7,
    margin: 20,
    padding: 20,
  },

  h1: {
    color: '#3C383F',
    fontFamily: fonts.semiBold,
    fontSize: 14,
  },
  h2: {
    color: '#9DA3B4',
    fontFamily: fonts.medium,
    fontSize: 12,
    marginTop: 2,
  },
  h3: {
    color: '#9DA3B4',
    fontFamily: fonts.regular,
    fontSize: 10,
    marginTop: 6,
  },
  stuff: {
    marginTop: 30,
  },
  stuffContainer: {
    flexDirection: 'row',
  },
  stuffText: {
    marginLeft: 10,
  },
})

export default TransferTicket
