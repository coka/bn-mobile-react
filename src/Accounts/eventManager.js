import React, {Component} from 'react';
import {Text, View, Image, ScrollView, TouchableHighlight} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import AccountStyles from '../styles/account/accountStyles'
import EventManagerStyles from '../styles/account/eventManagerStyles'

const styles = SharedStyles.createStyles()
const accountStyles = AccountStyles.createStyles()
const eventManagerStyles = EventManagerStyles.createStyles()

export default class EventManager extends Component {
  constructor(props) {
    super(props)
  }

  // NOTE: eventToScan doesn't matter yet, need to talk to api guys about validating
  // that ticket presented is for this event
  // only ticket redeem datapoints atm are ticket_id and redeem_key, user could
  // presumably use stale tickets that they never redeemed to enter new events
  scanForEvent = async (event) => {
    const {navigation: {navigate}, screenProps: {eventManager}} = this.props;

    await eventManager.scanForEvent(event);
    navigate('EventScanner');
  }

  loadEvents = () => {
    const {screenProps: {eventManager}} = this.props;

    eventManager.getEvents();
  }

  eventCard = (event) => {
    return (
      <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={() => this.scanForEvent(event)} key={event.id}>
        <View style={eventManagerStyles.cardContainer}>
          <View style={eventManagerStyles.cardImageWrapper}>
            <Image
              style={eventManagerStyles.cardImage}
              source={{uri: event.promo_image_url}}
            />
          </View>
          <View style={eventManagerStyles.textWrapper}>
            <Text numberOfLines={1} style={styles.headerSecondary}>{event.name}</Text>
            <Text numberOfLines={1} style={eventManagerStyles.cardSubHeader}>{event.venue.name} &bull; {event.scheduleText}</Text>
          </View>
          <Icon style={[accountStyles.accountArrow, styles.paddingTop]} name="keyboard-arrow-right" />
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    const {screenProps: {eventManager}} = this.props;

    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.containerDark}>
        <NavigationEvents
          onWillFocus={this.loadEvents}
        />
        <View style={[styles.paddingVerticalMedium, styles.paddingHorizontal]}>
          {eventManager.events.map(this.eventCard)}
          {/* TODO: figure out how to differentiate live vs upcoming and perhaps scope events relevant to the doorman? */}
          {/* <Text style={eventManagerStyles.sectionHeader}>Live</Text> */}
          {/* <Text style={[eventManagerStyles.sectionHeader, styles.paddingTopSmall]}>Upcoming</Text> */}
        </View>
      </ScrollView>
    );
  }
}
