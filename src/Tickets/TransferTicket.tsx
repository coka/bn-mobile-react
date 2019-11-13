import React from 'react'
import {
  ActivityIndicator,
  Image,
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
import { openVenueDirections } from '../directions'
import SharedStyles, { colors } from '../styles/shared/sharedStyles'
import TicketStyles from '../styles/tickets/ticketStyles'
import TicketWalletStyles from '../styles/tickets/ticketWalletStyles'
import TransferActivityEvent from './TransferActivityEvent'

interface Props {
  event: Event
  cancelTransfer(transferId: string): void
  isCancelling: boolean
  transferActivities: Array<TransferActivity>
}

const sharedStyles = SharedStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()
const ticketWalletStyles = TicketWalletStyles.createStyles()

const TransferTicket = ({
  event,
  cancelTransfer,
  isCancelling,
  transferActivities,
}: Props) => (
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
            {/*
             * Here we assume that all transfer activities have been initiated
             * by the same user, and that there is always at least one transfer
             * activity.
             * */}
            {transferActivities[0].initiated_by.full_name}
          </Text>
          {/* TODO: Display correct ticket type names once the API is ready. */}
          {/* <Text style={ticketStyles.ticketHolderSubheader}>
            GENERAL ADMISSION
          </Text> */}
        </View>
      </View>
    </View>
    <ScrollView
      style={styles.activityContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.activityGroup}>
        {transferActivities.map((activity, index) => (
          <TransferActivityEvent
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
        <BottomNavContent
          cancelTransfer={cancelTransfer}
          isCancelling={isCancelling}
          transferActivities={transferActivities}
        />
      </View>
    </View>
  </View>
)

interface BottomNavContentProps {
  cancelTransfer(transferId: string): void
  isCancelling: boolean
  transferActivities: Array<TransferActivity>
}

const BottomNavContent = ({
  cancelTransfer,
  isCancelling,
  transferActivities,
}: BottomNavContentProps): JSX.Element => {
  if (isCancelling) {
    return (
      <View style={ticketWalletStyles.bottomNavLinkContainer}>
        <ActivityIndicator color={colors.brand} />
      </View>
    )
  }

  const lastTransferActivity = transferActivities[0]
  switch (lastTransferActivity.action) {
    case 'Accepted':
      return (
        <View style={ticketWalletStyles.bottomNavLinkContainer}>
          <Text style={ticketWalletStyles.bottomNavLinkText}>
            TRANSFER COMPLETED
          </Text>
        </View>
      )
    case 'Cancelled':
      return (
        <View style={ticketWalletStyles.bottomNavLinkContainer}>
          <Text style={ticketWalletStyles.bottomNavLinkText}>
            TRANSFER CANCELLED
          </Text>
        </View>
      )
    case 'Started':
      return (
        <TouchableHighlight
          underlayColor="rgba(0, 0, 0, 0)"
          onPress={() => cancelTransfer(transferActivities[0].transfer_id)}
        >
          <View style={ticketWalletStyles.bottomNavLinkContainer}>
            <Text style={ticketWalletStyles.bottomNavLinkText}>
              CANCEL TRANSFER
            </Text>
            <Icon style={ticketWalletStyles.bottomNavIcon} name="launch" />
          </View>
        </TouchableHighlight>
      )
  }
}

const styles = StyleSheet.create({
  activityContainer: {
    backgroundColor: '#f7f7f7',
    height: 272,
    marginRight: 19, // dirty hack to keep it within the parent
  },
  activityGroup: {
    backgroundColor: colors.white,
    borderRadius: 7,
    margin: 20,
    padding: 20,
  },
})

export default TransferTicket
