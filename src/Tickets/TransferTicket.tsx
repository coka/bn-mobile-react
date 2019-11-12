import React from 'react'
import {
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
  transferActivities: Array<TransferActivity>
}

const sharedStyles = SharedStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()
const ticketWalletStyles = TicketWalletStyles.createStyles()

const TransferTicket = ({
  event,
  cancelTransfer,
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
            {/* TODO: Ideally, we would have the original ticket holder in the
                      root of the model. */}
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
      </View>
    </View>
  </View>
)

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
