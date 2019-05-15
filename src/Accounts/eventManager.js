import React, {Component} from 'react'
import {Text, View, Image, ScrollView, TouchableHighlight} from 'react-native'
import {NavigationEvents} from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import AccountStyles from '../styles/account/accountStyles'
import EventManagerStyles from '../styles/account/eventManagerStyles'
import {optimizeCloudinaryImage} from '../cloudinary'

const styles = SharedStyles.createStyles()
const accountStyles = AccountStyles.createStyles()
const eventManagerStyles = EventManagerStyles.createStyles()

function DoorEventCard({event, onPress}) {
  return (
    <TouchableHighlight
      underlayColor="rgba(0, 0, 0, 0)"
      onPress={onPress}
      key={event.id}
    >
      <View style={eventManagerStyles.cardContainer}>
        <View style={eventManagerStyles.cardImageWrapper}>
          <Image
            style={eventManagerStyles.cardImage}
            source={{uri: optimizeCloudinaryImage(event.promo_image_url)}}
          />
        </View>
        <View style={eventManagerStyles.textWrapper}>
          <Text numberOfLines={1} style={styles.headerSecondary}>
            {event.name}
          </Text>
          {/* TODO: Add venue info and times */}
          {/* <Text numberOfLines={1} style={eventManagerStyles.cardSubHeader}>{event.venue.name} &bull; {event.scheduleText}</Text> */}
        </View>
        <Icon
          style={[accountStyles.accountArrow, styles.paddingTop]}
          name="keyboard-arrow-right"
        />
      </View>
    </TouchableHighlight>
  )
}

export default class EventManager extends Component {
  chooseEvent = (event) => this.props.navigation.navigate('DoorEvent', {event})

  loadEvents = () => this.props.screenProps.eventManager.getEvents()

  createOnPress = (event) => () => this.chooseEvent(event)

  toCard = (event) => (
    <DoorEventCard
      key={event.id}
      event={event}
      onPress={this.createOnPress(event)}
    />
  )

  get eventCards() {
    return this.props.screenProps.eventManager.events.map(this.toCard)
  }

  render() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.containerDark}
      >
        <NavigationEvents onWillFocus={this.loadEvents} />
        <View style={[styles.paddingVerticalMedium, styles.paddingHorizontal]}>
          {this.eventCards}
        </View>
      </ScrollView>
    )
  }
}
