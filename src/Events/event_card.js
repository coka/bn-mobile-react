import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, View, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import EventCardStyles from '../styles/shared/eventCardStyles'
import { eventDateTimes } from '../time'
import { toDollars } from '../constants/money'
import { optimizeCloudinaryImage } from '../cloudinary'
import { Image } from 'react-native-expo-image-cache'

const styles = SharedStyles.createStyles()
const eventCardStyles = EventCardStyles.createStyles()

export default class EventsIndex extends Component {
  static propTypes = {
    event: PropTypes.object,
    onPress: PropTypes.func,
    onInterested: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      favorite: props.event.user_is_interested
    }
  }

  componentWillReceiveProps(nextProps) {
    const { event } = this.props
    if (nextProps.event.user_is_interested !== event.user_is_interested) {
      this.setState({ favorite: nextProps.event.user_is_interested })
    }
  }

  setFavorite = (e) => {
    e.stopPropagation()
    const { onInterested, event } = this.props
    onInterested(event, true)
    this.setState(prevState => ({
      favorite: !prevState.favorite,
    }))
  }

  get scheduleText() {
    return eventDateTimes(
      this.props.event.localized_times
    ).event_start.toFormat('EEE, MMMM d')
  }

  get priceTag() {
    const {
      event: { min_ticket_price },
    } = this.props

    if (min_ticket_price) {
      return (
        <View style={styles.priceTagContainer}>
          <Text style={styles.priceTag}>{`$${toDollars(
            min_ticket_price,
            0
          )}`}</Text>
        </View>
      )
    } else {
      return null
    }
  }

  get location() {
    const {
      event: {
        venue: { city, state },
      },
    } = this.props

    return state ? `${city}, ${state}` : city
  }

  render() {
    const { onPress, event } = this.props
    const { favorite } = this.state

    return (
      <TouchableHighlight underlayColor="#fff" onPress={onPress}>
        <View>
          <View style={eventCardStyles.eventContainer}>
            <Image
              uri={optimizeCloudinaryImage(event.promo_image_url)}
              style={eventCardStyles.eventImage}
              defaultSource={require('../../assets/event-placeholder.png')}
            />
            <View style={eventCardStyles.detailsContainer}>
              <View style={eventCardStyles.sectionTop}>
                <TouchableHighlight
                  underlayColor="rgba(0, 0, 0, 0)"
                  onPress={this.setFavorite}
                >
                  <View
                    style={
                      favorite ?
                        eventCardStyles.iconLinkCircleContainerSmallActive :
                        eventCardStyles.iconLinkCircleContainerSmall
                    }
                  >
                    <Icon
                      style={
                        favorite ?
                          eventCardStyles.iconLinkCircleSmallActive :
                          eventCardStyles.iconLinkCircleSmall
                      }
                      name="star"
                    />
                  </View>
                </TouchableHighlight>
              </View>
              {this.priceTag}
            </View>
          </View>

          <View style={eventCardStyles.detailsContainerBottom}>
            <Text style={eventCardStyles.header}>{event.name}</Text>
            <Text style={eventCardStyles.details}>{this.scheduleText}</Text>
            <Text style={eventCardStyles.details}>{this.location}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}
