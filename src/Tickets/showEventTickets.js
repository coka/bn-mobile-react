import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Text, View, Image} from 'react-native'
import Carousel, {Pagination} from 'react-native-snap-carousel'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Ticket from './Ticket'
import SharedStyles from '../styles/shared/sharedStyles'
import TicketWalletStyles from '../styles/tickets/ticketWalletStyles'
import {Brightness} from 'expo'
import {optimizeCloudinaryImage} from '../cloudinary'

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
        store: {ticketsForEvent},
      },
      navigation: {
        state: {
          params: {activeTab, eventId},
        },
      },
    } = this.props

    return ticketsForEvent(activeTab, eventId)
  }

  get event() {
    return this.eventAndTickets.event
  }

  get tickets() {
    return this.eventAndTickets.tickets
  }

  get ticketData() {
    const event = this.event || {}

    return this.tickets.map((ticket) => ({
      image: optimizeCloudinaryImage(event.promo_image_url),
      name: event.name,
      venue: event.venue.name,
      location: `${event.venue.city}, ${event.venue.state}`,
      venue_addr: event.venue,
      date: event.formattedDate,
      starts: event.formattedStart,
      doors: event.formattedDoors,
      user: 'Test Name',
      ticketType: ticket.ticket_type_name,
      eventId: event.id,
      ticketId: ticket.id,
      status: ticket.status,
    }))
  }

  _renderItem = ({item, _index}) => {
    const {
      navigation: {
        navigate,
        state: {
          params: {activeTab},
        },
      },
      screenProps: {
        store: {redeemTicketInfo},
      },
    } = this.props

    return (
      <Ticket
        activeTab={activeTab}
        ticket={item}
        navigate={navigate}
        redeemTicketInfo={redeemTicketInfo}
      />
    )
  }

  render() {
    const {navigation} = this.props
    const {fullWidth, itemWidth} = TicketWalletStyles
    const {activeSlide} = this.state
    const tickets = this.ticketData

    return (
      <View style={ticketWalletStyles.modalContainer}>
        <Image
          style={ticketWalletStyles.modalBkgdImage}
          source={require('../../assets/account-placeholder-bkgd.png')}
        />
        <View>
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
              Ticket {activeSlide + 1} of {tickets.length}
            </Text>
            <Text>&nbsp; &nbsp;</Text>
          </View>
          <Carousel
            ref={(ref) => {
              this._ticketSlider = ref
            }}
            data={tickets}
            renderItem={this._renderItem}
            sliderWidth={fullWidth}
            itemWidth={itemWidth}
            slideStyle={ticketWalletStyles.slideWrapper}
            onSnapToItem={(index) => this.setState({activeSlide: index})}
            // The following line of code is a workaround for a bug. References:
            //
            // https://github.com/archriss/react-native-snap-carousel/issues/238
            // https://github.com/facebook/react-native/issues/1831
            removeClippedSubviews={false}
          />
          <Pagination
            dotsLength={tickets.length}
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
        </View>
      </View>
    )
  }
}
