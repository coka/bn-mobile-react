import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {ScrollView, Text, View, Image, TextInput, TouchableHighlight, Animated, Platform, RefreshControl, Easing} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons'
import ModalDropdown from 'react-native-modal-dropdown';
import SharedStyles from '../styles/shared/sharedStyles'
import FormStyles from '../styles/shared/formStyles'
import SlideShowStyles from '../styles/shared/slideshowStyles'
import NavigationStyles from '../styles/shared/navigationStyles'
import ModalStyles from '../styles/shared/modalStyles'
import EventItemView from './event_card'
import {DateTime} from 'luxon';
import TicketStyles from '../styles/tickets/ticketStyles'
import emptyState from '../../assets/icon-empty-state.png'

const styles = SharedStyles.createStyles()
const formStyles = FormStyles.createStyles()
const slideshowStyles = SlideShowStyles.createStyles()
const navigationStyles = NavigationStyles.createStyles()
const modalStyles = ModalStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()

const HEADER_MAX_HEIGHT = 0;
const HEADER_MIN_HEIGHT = -25;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

function EmptyEvents({locationName}) {
  return (
    <View style={ticketStyles.emptyStateContainer}>
      <Image
        style={ticketStyles.emptyStateIcon}
        source={emptyState}
      />
      <Text style={ticketStyles.emptyStateText}>{"More" + (locationName == "All Locations" ? null : " " + locationName) + " events and experiences powered by Big Neon launching soon!"}</Text>
    </View>
  )
}

export default class EventsIndex extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object,
  }

  /* eslint-disable-next-line complexity */
  constructor(props) {
    super(props);
    const {screenProps: {store}} = props
    const {state} = store

    this.state = {
      scrollY: new Animated.Value(
        Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
      ),
      refreshing: false,
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      selectedLocationId: state.selectedLocationId || 2,
      mainFavorite: true,
    };
  }

  componentWillReceiveProps(newProps) {
    // Check for updated Location
    const {screenProps: {store: {state: {selectedLocationId}}}} = newProps

    if (selectedLocationId !== this.state.selectedLocationId) {
      // also do some kind of event re-search action to load new city events
      this.setState({selectedLocationId})
    }
  }

  get locations() {
    return [
      {id: null, name: 'Where are you looking for events?', selectedName: 'All Locations'},
      ...this.props.screenProps.store.state.locations,
    ]
  }

  loadEvents() {
    const {screenProps: {store}} = this.props

    if (this.events.length === 0 || this.eventsRefresh) {
      store.getEvents()
    }
  }

  get eventsRefresh() {
    const {screenProps: {store: {state: {lastUpdate}}}} = this.props

    return !lastUpdate || lastUpdate.plus({minutes: 15}) < DateTime.local()
  }

  get events() {
    const {screenProps: {store: {state: {events, selectedLocationId}}}} = this.props

    if (!selectedLocationId) {
      return events
    }

    return events.filter(({venue: {region_id}}) => region_id === selectedLocationId)
  }

  setFavorite = (mainFavorite) => {
    this.setState({mainFavorite})
  }

  get currentLocationDisplayName() {
    const selectedLoc = this.locations.find((loc) => (loc.id === this.state.selectedLocationId))

    return selectedLoc && (selectedLoc.selectedName || selectedLoc.name) || ''
  }

  locRowOption = (rowData, rowID, _highlighted) => {
    if (rowID === '0') {
      return (
        <View>
          <View style={modalStyles.rowWrapper}>
            <Text style={modalStyles.sectionHeader}>{rowData.name}</Text>
          </View>
        </View>
      )
    } else {
      return (
        <View>
          <View style={modalStyles.rowWrapper}>
            <Icon style={modalStyles.locationIcon} name="location-on" />
            <Text style={modalStyles.locationText}>{rowData.name}</Text>
          </View>
        </View>
      )
    }
  }

  get allEvents() {
    const {navigation: {navigate}, screenProps: {store: {toggleInterest}}} = this.props
    const events = this.events
    if(events.length == 0){
      return <EmptyEvents locationName={this.currentLocationDisplayName} />
    }
    return events.map((event, index) => (
      <EventItemView
        key={index}
        onPress={() => navigate('EventsShow', {eventId: event.id})}
        event={event}
        onInterested={toggleInterest}
      />
    ))
  }

  /* eslint-disable-next-line complexity */
  render() {
    const scrollY = Animated.add(
      this.state.scrollY,
      Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
    );
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, 100],
      extrapolate: 'clamp',
    });
    const headerTranslate = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });
    const opacity = scrollY.interpolate({
      inputRange: [0, 0.9, 1],
      outputRange: [1, 0, 1],
    });

    const {navigation: {navigate}, screenProps: {store}} = this.props
    const {mainFavorite} = this.state

    return (
      <View style={styles.containerFullHeight}>
        <NavigationEvents
          onWillFocus={() => this.loadEvents()}
        />
        <ScrollView
          style={{flex:1}}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.setState({refreshing: true});
                setTimeout(() => this.setState({refreshing: false}), 1000);
              }}
              // Android offset for RefreshControl
              progressViewOffset={HEADER_MAX_HEIGHT}
            />
          }
          // iOS offset for RefreshControl
          contentInset={{
            top: HEADER_MAX_HEIGHT,
          }}
          contentOffset={{
            y: -HEADER_MAX_HEIGHT,
          }}
        >
          <View style={[styles.sectionHeaderContainer, styles.flexRowSpaceBetween]}>
            <Animated.Text style={[styles.header, {opacity}]}>Explore</Animated.Text>
            <ModalDropdown
              ref={(ref) => {
                this._dropdown = ref
              }}
              onSelect={store.changeLocation}
              options={this.locations}
              renderRow={this.locRowOption}
              renderSeparator={() => <View />}
              dropdownStyle={modalStyles.modalDropdownContainer}
            >
              <View style={styles.dropdownLinkContainer}>
                <Image
                  style={styles.iconImageSmall}
                  source={require('../../assets/heart-small.png')}
                />
                <Text style={styles.iconLinkText}>{this.currentLocationDisplayName}</Text>
                <Icon style={styles.iconLink} name="keyboard-arrow-down" />
              </View>
            </ModalDropdown>
          </View>

          {false && // TODO: Re-enable when functionality is implemented.
          <View style={formStyles.searchContainer}>
            <Image
              style={formStyles.searchIcon}
              source={require('../../assets/icon-search.png')}
            />
            <TextInput
              style={formStyles.searchInput}
              placeholder="Search artists, shows, venues..."
              searchIcon={{size: 24}}
              underlineColorAndroid="transparent"
              disabled
            />
          </View>
          }

          {false && // TODO: Re-enable when functionality is implemented.
          <Text style={styles.sectionHeader}>Hot This Week</Text>
          }

          {false && // TODO: Re-enable when functionality is implemented.
          <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={() => navigate('EventsShow', {name: 'Childish Gambino'})}>
            <View style={slideshowStyles.slideshowContainer}>
              <Image
                style={slideshowStyles.slideShowImage}
                source={require('../../assets/featured-1.png')}
              />
              <Image
                style={slideshowStyles.slideShowImage}
                source={require('../../assets/featured-img-overlay.png')}
              />

              <View style={slideshowStyles.detailsContainer}>
                <View style={slideshowStyles.sectionTop}>
                  <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={() => this.setFavorite(!mainFavorite)}>
                    <View style={mainFavorite ? styles.iconLinkCircleContainerActive : styles.iconLinkCircleContainer}>
                      <Icon style={mainFavorite ? styles.iconLinkCircleActive : styles.iconLinkCircle} name="star" />
                    </View>
                  </TouchableHighlight>
                  <View style={styles.avatarContainer}>
                    <Image
                      style={styles.avatar}
                      source={require('../../assets/avatar-male.png')}
                    />
                    <Image
                      style={styles.avatar}
                      source={require('../../assets/avatar-female.png')}
                    />
                  </View>
                </View>

                <View style={slideshowStyles.sectionMiddle}>
                  <Icon style={slideshowStyles.slideShowIconLinkLeft} name="keyboard-arrow-left" />
                  <Icon style={slideshowStyles.slideShowIconLinkRight} name="keyboard-arrow-right" />
                </View>
                <View>
                  <View style={styles.priceTagContainer}>
                    <Text style={styles.priceTag}>$30</Text>
                  </View>
                  <Text style={slideshowStyles.header}>Childish Gambino</Text>
                  <View style={styles.flexRowSpaceBetween}>
                    <Text style={slideshowStyles.details}>Fox Theater  &bull;  Oakland, CA</Text>
                    <Text style={slideshowStyles.details}>July 15, 2018</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>
          }

          <View style={styles.spacer} />

          {this.allEvents}

          <View style={styles.spacer} />
        </ScrollView>
        <Animated.View style={[navigationStyles.scrollHeaderContainer, {height: headerHeight, transform: [{translateY: headerTranslate}]}]}>
          <View style={navigationStyles.scrollHeader}>
            <Animated.Text style={[navigationStyles.scrollTitle, {opacity}]}>Explore</Animated.Text>
            <Animated.Text style={navigationStyles.scrollSubTitle}>All Dates &bull; {this.currentLocationDisplayName}</Animated.Text>
          </View>
        </Animated.View>
      </View>
    );
  }
}
