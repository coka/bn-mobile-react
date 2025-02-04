import * as Brightness from 'expo-brightness'
import { includes } from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { optimizeCloudinaryImage } from '../cloudinary'
import SharedStyles from '../styles/shared/sharedStyles'
import TicketWalletStyles from '../styles/tickets/ticketWalletStyles'
import Ticket from './Ticket'
import TransferTicket from './TransferTicket'

// In case we cannot get a value for the brightness from
// Brightness.getBrightnessAsync()
const DEFAULT_BRIGHTNESS = 0.5

const styles = SharedStyles.createStyles()

const ticketWalletStyles = TicketWalletStyles.createStyles()

async function getBrightness() {
  await Brightness.getBrightnessAsync()
}

/**
 *
 * Android doesn't return to initial brightness.
 * `setSystemBrightness`, which might be the solution,
 * is still experimental in Expo as of the time this comment was written.
 * https://github.com/revelrylabs/bn-mobile-react/issues/398
 * is still a problem, but included a default brightness value
 */
async function setBrightness(zeroToOne) {
  await Brightness.setBrightnessAsync(zeroToOne)
}

export default class EventsTicket extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    screenProps: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      activeSlide: 0,
    }

    this.doBrightness()
  }

  componentWillUnmount() {
    this.undoBrightness()
  }

  async doBrightness() {
    try {
      this._prevBrightness = (await getBrightness()) || DEFAULT_BRIGHTNESS

      await setBrightness(1)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Unable to set brightness. Error: ${error.message}`)
    }
  }

  async undoBrightness() {
    try {
      await setBrightness(this._prevBrightness)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Unable to set brightness. Error ${error.message}`)
    }
  }

  get eventAndTickets() {
    const {
      screenProps: {
        store: { ticketsForEvent },
        transfers,
      },
      navigation: {
        state: {
          params: { activeTab, eventId },
        },
      },
    } = this.props

    if (activeTab === 'transfer') {
      return (
        transfers.state.data.find(
          (transferItem) => transferItem.event.id === eventId
        ) || {}
      )
    }

    return ticketsForEvent(activeTab, eventId)
  }

  get event() {
    return (this.eventAndTickets || {}).event || {}
  }

  get tickets() {
    return (this.eventAndTickets || {}).tickets || []
  }

  get ticketData() {
    const event = this.event || {}

    const tickets = this.tickets.map((ticket) => ({
      image: optimizeCloudinaryImage(event.promo_image_url),
      name: event.name,
      venue: event.venue.name,
      location: `${event.venue.city}, ${event.venue.state}`,
      venue_addr: event.venue,
      date: event.formattedDate,
      starts: event.formattedStart,
      doors: event.formattedDoors,
      user: 'Test Name',
      transferAddress: ticket.transfer_address,
      ticketType: ticket.ticket_type_name,
      transferId: ticket.transfer_id,
      eventId: event.id,
      ticketId: ticket.id,
      status: ticket.status,
    }))

    const statusCriteria = 'Redeemed'
    tickets.sort(function(a, b) {
      return a.status === statusCriteria && b.status !== statusCriteria
        ? 1
        : a.status !== statusCriteria && b.status === statusCriteria
        ? -1
        : 0
    })

    return tickets
  }

  _renderItem = ({ item, _index }) => {
    const {
      navigation,
      navigation: {
        state: {
          params: { activeTab },
        },
      },
      screenProps: {
        store: { redeemTicketInfo, cancelTicketTransfer },
        transfers: {
          cancelTransfer,
          state: { isCancelling },
        },
      },
    } = this.props
    return activeTab === 'transfer' ? (
      <TransferTicket
        event={item.event}
        cancelTransfer={cancelTransfer}
        isCancelling={isCancelling}
        navigation={navigation}
        transferActivities={item.ticketActivityItem}
      />
    ) : (
      <Ticket
        activeTab={activeTab}
        ticket={item}
        navigation={navigation}
        redeemTicketInfo={redeemTicketInfo}
        cancelTicketTransfer={cancelTicketTransfer}
      />
    )
  }

  render() {
    const { navigation } = this.props
    const { fullWidth, itemWidth } = TicketWalletStyles
    const { activeSlide } = this.state

    const { activeTab } = navigation.state.params
    let renderData
    if (activeTab === 'transfer') {
      const { event, ticket_activity_items } = this.eventAndTickets
      renderData = []
      if (ticket_activity_items) {
        const transferIds = []
        Object.keys(ticket_activity_items).forEach((key) => {
          const ticketActivityItem = ticket_activity_items[key]
          const transferId = ticketActivityItem[0].transfer_id
          if (!includes(transferIds, transferId)) {
            transferIds.push(transferId)
            renderData.push({ event, ticketActivityItem })
          }
        })
      }
    } else {
      renderData = this.ticketData
    }
    const numberOfItems = renderData.length

    return (
      <View style={ticketWalletStyles.modalContainer}>
        <Image
          style={ticketWalletStyles.modalBkgdImage}
          source={require('../../assets/account-placeholder-bkgd.png')}
        />
        <ScrollView scrollEnabled>
          <View
            style={[
              ticketWalletStyles.closeModalContainer,
              ticketWalletStyles.paddingTop,
            ]}
          >
            <Icon
              style={styles.iconLinkCircle}
              name="close"
              onPress={() => {
                navigation.goBack()
              }}
            />
            <Text style={ticketWalletStyles.closeModalHeader}>
              {activeTab === 'transfer' ? 'Transfer' : 'Ticket'}{' '}
              {activeSlide + 1} of {numberOfItems}
            </Text>
            <Text>&nbsp; &nbsp;</Text>
          </View>
          <Carousel
            ref={(ref) => {
              this._ticketSlider = ref
            }}
            data={renderData}
            renderItem={this._renderItem}
            sliderWidth={fullWidth}
            itemWidth={itemWidth}
            slideStyle={ticketWalletStyles.slideWrapper}
            onSnapToItem={(index) => this.setState({ activeSlide: index })}
            // The following line of code is a workaround for a bug. References:
            //
            // https://github.com/archriss/react-native-snap-carousel/issues/238
            // https://github.com/facebook/react-native/issues/1831
            removeClippedSubviews={false}
          />
          <Pagination
            dotsLength={numberOfItems}
            activeDotIndex={activeSlide}
            containerStyle={styles.paginationContainer}
            dotColor={'rgba(255, 255, 255, 0.92)'}
            dotStyle={styles.paginationDot}
            inactiveDotColor={'rgba(255, 255, 255, 0.3)'}
            inactiveDotOpacity={0.4}
            inactiveDotScale={1}
            carouselRef={this._ticketSlider}
            tappableDots={!!this._ticketSlider}
          />
        </ScrollView>
      </View>
    )
  }
}
