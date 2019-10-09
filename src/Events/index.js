import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  Animated,
  Platform,
  RefreshControl,
  Easing,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { NavigationEvents } from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import NavigationStyles from '../styles/shared/navigationStyles'
import ModalStyles from '../styles/shared/modalStyles'
import EventItemView from './event_card'
import EventSearch from './search'
import { DateTime } from 'luxon'
import TicketStyles from '../styles/tickets/ticketStyles'
import emptyState from '../../assets/icon-empty-state.png'

const styles = SharedStyles.createStyles()
const navigationStyles = NavigationStyles.createStyles()
const modalStyles = ModalStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()

const HEADER_MAX_HEIGHT = 0
const HEADER_MIN_HEIGHT = -25
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

function EmptyEvents({ locationName }) {
  return (
    <View style={ticketStyles.emptyStateContainer}>
      <Image style={ticketStyles.emptyStateIcon} source={emptyState} />
      <Text style={ticketStyles.emptyStateText}>
        {`There doesn't seem to be anything here.`}
      </Text>
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
    super(props)
    const {
      screenProps: { store },
    } = props
    const { state } = store

    this.state = {
      scrollY: new Animated.Value(
        Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0
      ),
      refreshing: false,
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      selectedLocationId: state.selectedLocationId || 2,
    }
  }

  componentWillReceiveProps(newProps) {
    // Check for updated Location
    const {
      screenProps: {
        store: {
          state: { selectedLocationId },
        },
      },
    } = newProps

    if (selectedLocationId !== this.state.selectedLocationId) {
      // also do some kind of event re-search action to load new city events
      this.setState({ selectedLocationId })
    }
  }

  get locations() {
    return [
      {
        id: null,
        name: 'Where are you looking for events?',
        selectedName: 'All Locations',
      },
      ...this.props.screenProps.store.state.locations,
    ]
  }

  loadEvents() {
    const {
      screenProps: { store },
    } = this.props

    if (this.events.length === 0 || this.eventsRefresh) {
      store.getEvents()
    }
  }

  get eventsRefresh() {
    const {
      screenProps: {
        store: {
          state: { lastUpdate },
        },
      },
    } = this.props

    return !lastUpdate || lastUpdate.plus({ minutes: 15 }) < DateTime.local()
  }

  get events() {
    const {
      screenProps: {
        store: {
          state: { events },
        },
      },
    } = this.props

    return events
  }

  get currentLocationDisplayName() {
    const selectedLoc = this.locations.find(
      (loc) => loc.id === this.state.selectedLocationId
    )

    // Limit before having to truncate
    const characterLimit = 18

    let name =
      (selectedLoc && (selectedLoc.selectedName || selectedLoc.name)) || ''

    if (name.length > characterLimit) {
      name = name.substring(0, characterLimit)
    }

    return name
  }

  locRowOption = (rowData, rowID, _highlighted) => {
    if (rowID === '0') {
      return (
        <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)">
          <View>
            <View style={modalStyles.rowWrapper}>
              <Text style={modalStyles.sectionHeader}>{rowData.name}</Text>
            </View>
          </View>
        </TouchableHighlight>
      )
    } else {
      return (
        <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)">
          <View>
            <View style={modalStyles.rowWrapper}>
              <Icon style={modalStyles.locationIcon} name="location-on" />
              <Text style={modalStyles.locationText}>{rowData.name}</Text>
            </View>
          </View>
        </TouchableHighlight>
      )
    }
  }

  _handleRefresh = () => {
    const {
      screenProps: {
        store: { refreshEvents },
      },
    } = this.props

    this.setState({ refreshing: true })
    refreshEvents(() => this.setState({ refreshing: false }))
  }

  _handleLoadMore = () => {
    const {
      screenProps: {
        store: { fetchNextPage, hasNextPage },
      },
    } = this.props

    // check if we have more pages
    if (!hasNextPage) {
      return null
    }

    // If we do, fetch the next one
    fetchNextPage()
  }

  onLocationChanged = (event, location) => {
    const {
      screenProps: { store },
    } = this.props

    store.getEvents({
      page: 0,
      selectedLocationId: location.id,
      replaceEvents: true,
    })
  }

  get loadingMoreEvents() {
    const {
      screenProps: {
        store: {
          state: { loading },
        },
      },
    } = this.props
    const events = this.events

    if (events.length !== 0 && !this.state.refreshing && loading) {
      // Dont show the bottom loader when pull to refresh. or on empty page
      return <Text>Loading...</Text>
    }

    return null
  }

  get headerElement() {
    const scrollY = Animated.add(
      this.state.scrollY,
      Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0
    )
    const opacity = scrollY.interpolate({
      inputRange: [0, 0.9, 1],
      outputRange: [1, 0, 1],
    })

    const {
      navigation: { navigate },
      screenProps: { store },
    } = this.props

    return (
      <View>
        <View
          style={[styles.sectionHeaderContainer, styles.flexRowSpaceBetween]}
        >
          <Animated.Text style={[styles.header, { opacity }]}>
            Explore
          </Animated.Text>
          {/* Removed due to issue #118 */}
          {/* <ModalDropdown
            ref={(ref) => {
              this._dropdown = ref
            }}
            onSelect={this.onLocationChanged}
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
              <Text style={styles.iconLinkText}>
                {this.currentLocationDisplayName}
              </Text>
              <Icon style={styles.iconLink} name="keyboard-arrow-down" />
            </View>
          </ModalDropdown> */}
        </View>
        <EventSearch navigate={navigate} store={store} />
      </View>
    )
  }

  get footerElement() {
    const {
      screenProps: {
        store: {
          state: { loading },
        },
      },
    } = this.props

    if (!loading) {
      return null
    }

    return (
      <View
        style={{
          position: 'relative',
          width: styles.fullWidth,
          height: 160,
          paddingVertical: 20,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    )
  }

  goToEventDetails = (eventId, event) => {
    const {
      navigation: { navigate },
      screenProps: {
        store: {
          setQuery
        }
      },
    } = this.props
    setQuery('')
    this._handleRefresh()
    navigate('EventsShow', { eventId, event })
  }

  /* eslint-disable-next-line complexity */
  render() {
    const scrollY = Animated.add(
      this.state.scrollY,
      Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0
    )
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, 100],
      extrapolate: 'clamp',
    })
    const headerTranslate = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    })
    const opacity = scrollY.interpolate({
      inputRange: [0, 0.9, 1],
      outputRange: [1, 0, 1],
    })

    const {
      screenProps: {
        store: { toggleInterest },
      },
    } = this.props
    const events = this.events

    return (
      <View style={styles.containerFullHeight}>
        <NavigationEvents onDidFocus={() => this.loadEvents()} />
        <FlatList
          style={{ flex: 1 }}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } },
          ])}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._handleRefresh}
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
          data={events}
          keyExtractor={(event) => event.id}
          ListHeaderComponent={this.headerElement}
          ListFooterComponent={this.footerElement}
          ListEmptyComponent={
            <EmptyEvents locationName={this.currentLocationDisplayName} />
          }
          renderItem={({ item }) => (
            <EventItemView
              onPress={() => this.goToEventDetails(item.id, item)}
              event={item}
              onInterested={toggleInterest}
            />
          )}
          onEndReached={this._handleLoadMore}
          onEndReachedThreshold={0.5}
        />

        <Animated.View
          style={[
            navigationStyles.scrollHeaderContainer,
            { height: headerHeight, transform: [{ translateY: headerTranslate }] },
          ]}
        >
          <View style={navigationStyles.scrollHeader}>
            <Animated.Text style={[navigationStyles.scrollTitle, { opacity }]}>
              Explore
            </Animated.Text>
            <Animated.Text style={navigationStyles.scrollSubTitle}>
              All Dates &bull; {this.currentLocationDisplayName}
            </Animated.Text>
          </View>
        </Animated.View>
      </View>
    )
  }
}
