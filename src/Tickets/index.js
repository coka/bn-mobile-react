import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import {
  Text,
  View,
  Animated,
  TouchableHighlight,
  FlatList,
  Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import SlideShowStyles from '../styles/shared/slideshowStyles'
import TicketStyles from '../styles/tickets/ticketStyles'
import emptyState from '../../assets/icon-empty-state.png'
import imageOverlay from '../../assets/event-img-overlay.png'
import { some } from 'lodash'
import { NavigationEvents } from 'react-navigation'
import { optimizeCloudinaryImage } from '../cloudinary'
import { Image as CachedImage } from 'react-native-expo-image-cache'

const styles = SharedStyles.createStyles()
const slideshowStyles = SlideShowStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()

// The height of one ticket. Used for determining scroll position
const TICKET_HEIGHT = 265

function EmptyTickets({ text }) {
  return (
    <View style={ticketStyles.emptyStateContainer}>
      <Image style={ticketStyles.emptyStateIcon} source={emptyState} />
      <Text style={ticketStyles.emptyStateText}>{text}</Text>
    </View>
  )
}

class AnimatedTicket extends React.Component {
  componentDidMount() {
    this.props.requestScrollToTicket(this.props.index)
  }

  render() {
    return (
      <Animated.View style={{ transform: [{ scale: this.props.springValue }] }}>
        <Ticket
          navigate={this.props.navigate}
          ticket={this.props.ticket}
          activeTab={this.props.activeTab}
          setPurchasedTicket={this.props.setPurchasedTicket}
        />
      </Animated.View>
    )
  }
}

AnimatedTicket.propTypes = {
  navigate: PropTypes.func.isRequired,
  ticket: PropTypes.object.isRequired,
  springValue: PropTypes.object.isRequired,
  requestScrollToTicket: PropTypes.func.isRequired,
}

const Ticket = ({ navigate, ticket, activeTab, setPurchasedTicket }) => {
  const { event, tickets } = ticket

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
                  x {tickets.length}
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

Ticket.propTypes = {
  navigate: PropTypes.func.isRequired,
  ticket: PropTypes.object.isRequired,
}

class TicketsView extends React.Component {
  componentDidMount() {
    // Capturing if we scrolled to a ticket
    this.animatedTicketIndex = null
    this.scrolled = false
  }

  requestScrollToTicket = (index) => {
    this.animatedTicketIndex = index
    this.scrolled = false
  }

  maybeScrollToTicket(ref) {
    if (
      ref != null &&
      this.scrolled === false &&
      this.animatedTicketIndex !== null
    ) {
      ref.scrollToIndex({
        animated: true,
        index: this.animatedTicketIndex,
      })

      this.scrolled = true
    }
  }

  render() {
    const {
      activeTab,
      emptyText,
      tickets,
      navigate,
      springValue,
      purchasedTicket,
      setPurchasedTicket,
    } = this.props

    if (!tickets.length) {
      return <EmptyTickets text={emptyText} />
    }

    return (
      <FlatList
        {...this.props}
        ref={(ref) => {
          this.maybeScrollToTicket(ref)
        }}
        keyExtractor={(item, _) => item.event.id}
        getItemLayout={(_data, index) => ({
          length: TICKET_HEIGHT,
          offset: TICKET_HEIGHT * index,
          index,
        })}
        data={tickets}
        renderItem={({ item, index }) => {
          return some(
            item.tickets,
            ({ order_id }) => order_id === purchasedTicket
          ) ? (
              <AnimatedTicket
                navigate={navigate}
                ticket={item}
                activeTab={activeTab}
                springValue={springValue}
                setPurchasedTicket={setPurchasedTicket}
                requestScrollToTicket={this.requestScrollToTicket}
                index={index}
              />
            ) : (
              <Ticket
                navigate={navigate}
                activeTab={activeTab}
                ticket={item}
                setPurchasedTicket={setPurchasedTicket}
              />
            )
        }}
      />
    )
  }
}

TicketsView.propTypes = {
  navigate: PropTypes.func.isRequired,
  tickets: PropTypes.array.isRequired,
  springValue: PropTypes.object.isRequired,
}

const EMPTY_TEXT_FOR_ACTIVE_TAB = {
  upcoming:
    'Looks like you don’t have any upcoming events! Why not tap Explore and have a look?',
  past:
    'Looks like you haven’t attended any events yet! Why not tap Explore and find your first?',
  transfer:
    'Looks like you haven’t transfered any tickets yet. Know anyone that wants to go?',
}

export default class MyTickets extends Component {
  constructor(props) {
    super(props)
    this.props.screenProps.auth.identify()
    this.springValue = new Animated.Value(0.3)
  }

  get activeTab() {
    return this.props.navigation.getParam('activeTab', 'upcoming')
  }

  set activeTab(activeTab) {
    this.props.navigation.setParams({ activeTab })
  }

  spring() {
    this.springValue.setValue(0.3)
    Animated.spring(this.springValue, {
      toValue: 1,
      friction: 1,
      tension: 1,
    }).start()
  }

  tabStyle(viewType) {
    return viewType === this.activeTab ?
      styles.subnavHeaderActive :
      styles.subnavHeader
  }

  tabWrapperStyle(viewType) {
    return viewType === this.activeTab ? styles.activeWrapper : null
  }

  get ticketsForActiveView() {
    return this.props.screenProps.store.state.tickets[this.activeTab] || []
  }

  get emptyText() {
    return EMPTY_TEXT_FOR_ACTIVE_TAB[this.activeTab]
  }

  refreshTickets = async () => {
    await this.props.screenProps.store.userTickets()
    this.spring()
  }

  changeTab = (tab) => {
    this.props.screenProps.store.setPurchasedTicket(null)
    this.activeTab = tab
  }

  render() {
    const {
      navigation: { navigate },
      screenProps: {
        store: {
          setPurchasedTicket,
          state: { purchasedTicket },
        },
      },
    } = this.props

    return (
      <View style={styles.containerDark}>
        <NavigationEvents
          onWillFocus={this.refreshTickets}
          onDidBlur={() => setPurchasedTicket(null)}
        />
        <View style={styles.headerContainer}>
          <View style={[styles.sectionHeaderContainer, styles.flexRowCenter]}>
            <Image
              style={[styles.iconImage, styles.marginBottomSmall]}
              source={require('../../assets/heart-large.png')}
            />
          </View>
        </View>
        <View style={styles.subnavContainer}>
          <View style={this.tabWrapperStyle('upcoming')}>
            <Text
              style={this.tabStyle('upcoming')}
              onPress={() => this.changeTab('upcoming')}
            >
              UPCOMING
            </Text>
          </View>
          <View style={this.tabWrapperStyle('past')}>
            <Text
              style={this.tabStyle('past')}
              onPress={() => this.changeTab('past')}
            >
              PAST
            </Text>
          </View>
          <View style={this.tabWrapperStyle('transfer')}>
            <Text
              style={this.tabStyle('transfer')}
              onPress={() => this.changeTab('transfer')}
            >
              TRANSFERS
            </Text>
          </View>
        </View>
        <TicketsView
          style={styles.paddingHorizontal}
          showsVerticalScrollIndicator={false}
          emptyText={this.emptyText}
          navigate={navigate}
          tickets={this.ticketsForActiveView}
          springValue={this.springValue}
          purchasedTicket={purchasedTicket}
          activeTab={this.activeTab}
          setPurchasedTicket={setPurchasedTicket}
        />
      </View>
    )
  }
}

MyTickets.propTypes = {
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
}
