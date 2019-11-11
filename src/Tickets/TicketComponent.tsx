// TODO: Rename this file so that it doesn't clash with Ticket.js.
import React from 'react'
import { Image, Text, TouchableHighlight, View } from 'react-native'
import { Image as CachedImage } from 'react-native-expo-image-cache'
// TODO: Fix this import error.
import Icon from 'react-native-vector-icons/MaterialIcons'
import { optimizeCloudinaryImage } from '../cloudinary'
import SharedStyles from '../styles/shared/sharedStyles'
import SlideShowStyles from '../styles/shared/slideshowStyles'
import TicketStyles from '../styles/tickets/ticketStyles'

export interface Props {
  activeTab: any
  navigate: any
  setPurchasedTicket: any
  ticket: any
}

const imageOverlay = require('../../assets/event-img-overlay.png')
const styles = SharedStyles.createStyles()
const slideshowStyles = SlideShowStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()

const TicketComponent = ({
  navigate,
  ticket,
  activeTab,
  setPurchasedTicket,
}: Props) => {
  const { event } = ticket
  const numberOfTickets =
    activeTab === 'transfer'
      ? Object.keys(ticket.ticket_activity_items).length
      : ticket.tickets.length

  return (
    <View>
      <TouchableHighlight
        underlayColor={styles.underlayColor}
        onPress={() => {
          setPurchasedTicket(null)
          navigate('EventTickets', { eventId: event.id, activeTab })
        }}
      >
        <View style={ticketStyles.ticketContainer}>
          <CachedImage
            style={ticketStyles.eventImage}
            uri={optimizeCloudinaryImage(event.promo_image_url)}
          />
          <Image style={ticketStyles.eventImageOverlay} source={imageOverlay} />
          <View style={ticketStyles.detailsContainer}>
            <View>
              <View style={styles.iconLinkContainer}>
                <Icon style={ticketStyles.iconTicket} name="local-activity" />
                <Text style={ticketStyles.iconTicketText}>
                  x {numberOfTickets}
                </Text>
              </View>
            </View>
            <View>
              <Text numberOfLines={1} style={ticketStyles.header}>
                {event.name}
              </Text>
              <Text numberOfLines={1} style={slideshowStyles.details}>
                {event.venue.name} | {event.venue.city}, {event.venue.state}
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>

      <View
        style={[ticketStyles.ticketContainerBottom, styles.borderBottomRadius]}
      >
        <View style={ticketStyles.detailsContainerBottom}>
          <View>
            <Text style={ticketStyles.detailsBottomHeader}>DATE</Text>
            <Text style={ticketStyles.detailsBottomText}>
              {event.formattedDate}
            </Text>
          </View>
          <View>
            <Text style={ticketStyles.detailsBottomHeader}>DOORS</Text>
            <Text style={ticketStyles.detailsBottomText}>
              {event.formattedDoors}
            </Text>
          </View>
          <View>
            <Text
              style={[
                ticketStyles.detailsBottomHeader,
                ticketStyles.detailsLast,
              ]}
            >
              SHOW
            </Text>
            <Text
              style={[ticketStyles.detailsBottomText, ticketStyles.detailsLast]}
            >
              {event.formattedStart}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default TicketComponent
