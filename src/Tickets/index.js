import React, {Component} from 'react';
import {PropTypes} from 'prop-types'
import {ScrollView, Text, View, Image, Animated, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import SlideShowStyles from '../styles/shared/slideshowStyles'
import TicketStyles from '../styles/tickets/ticketStyles'
import emptyState from '../../assets/icon-empty-state.png'
import imageOverlay from '../../assets/event-img-overlay.png'
import {some} from 'lodash'
import {NavigationEvents} from 'react-navigation'

const styles = SharedStyles.createStyles()
const slideshowStyles = SlideShowStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()

function EmptyTickets({text}) {
  return (
    <View style={ticketStyles.emptyStateContainer}>
      <Image
        style={ticketStyles.emptyStateIcon}
        source={emptyState}
      />
      <Text style={ticketStyles.emptyStateText}>{text}</Text>
    </View>
  )
}

const AnimatedTicket = ({navigate, ticket, springValue}) => (
  <Animated.View style={{transform: [{scale: springValue}]}}>
    <Ticket navigate={navigate} ticket={ticket} />
  </Animated.View>
)

AnimatedTicket.propTypes = {
  navigate: PropTypes.func.isRequired,
  ticket: PropTypes.object.isRequired,
  springValue: PropTypes.object.isRequired,
}

const Ticket = ({navigate, ticket, qrEnabled}) => {
  const {event, tickets} = ticket

  return (
    <View>
      <TouchableHighlight underlayColor="#F5F6F7" onPress={() => navigate('EventTickets', {eventId: event.id, qrEnabled})}>
        <View style={ticketStyles.ticketContainer}>
          <Image
            style={ticketStyles.eventImage}
            source={{uri: event.promo_image_url}}
          />
          <Image
            style={ticketStyles.eventImageOverlay}
            source={imageOverlay}
          />
          <View style={ticketStyles.detailsContainer}>
            <View>
              <View style={styles.iconLinkContainer}>
                <Icon style={ticketStyles.iconTicket} name="local-activity" />
                <Text style={ticketStyles.iconTicketText}>x {tickets.length}</Text>
              </View>
            </View>
            <View>
              <Text numberOfLines={1} style={ticketStyles.header}>{event.name}</Text>
              <Text numberOfLines={1} style={slideshowStyles.details}>{event.venue.name} | {event.venue.city}, {event.venue.state}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>

      <View style={[ticketStyles.ticketContainerBottom, styles.borderBottomRadius]}>
        <View style={ticketStyles.detailsContainerBottom}>
          <View>
            <Text style={ticketStyles.detailsBottomHeader}>DATE</Text>
            <Text style={ticketStyles.detailsBottomText}>{event.formattedDate}</Text>
          </View>
          <View>
            <Text style={ticketStyles.detailsBottomHeader}>DOORS</Text>
            <Text style={ticketStyles.detailsBottomText}>{event.formattedDoors}</Text>
          </View>
          <View>
            <Text style={[ticketStyles.detailsBottomHeader, ticketStyles.detailsLast]}>SHOW</Text>
            <Text style={[ticketStyles.detailsBottomText, ticketStyles.detailsLast]}>{event.formattedShow}</Text>
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

const TicketsView = ({qrEnabled, emptyText, tickets, navigate, springValue, purchasedTicket}) => {
  if (!tickets.length) {
    return <EmptyTickets text={emptyText} />
  }

  return tickets.map((ticket) => (
    some(ticket.tickets, ({order_id}) => order_id === purchasedTicket) ?
      <AnimatedTicket
        key={ticket.event.name}
        navigate={navigate}
        ticket={ticket}
        springValue={springValue}
      /> :
      <Ticket {...{navigate, qrEnabled}} key={ticket.event.name} ticket={ticket} />
  ))
}

TicketsView.propTypes = {
  navigate: PropTypes.func.isRequired,
  tickets: PropTypes.array.isRequired,
  springValue: PropTypes.object.isRequired,
}

const EMPTY_TEXT_FOR_ACTIVE_TAB = { 
  upcoming: 'Looks like you don’t have any upcoming events! Why not tap Explore and have a look?',
  past: 'Looks like you haven’t attended any events yet! Why not tap Explore and find your first?',
  transfer: 'Looks like you haven’t transfered any tickets yet. Know anyone that wants to go?',
}

export default class MyTickets extends Component {

  constructor(props) {
    super(props)

    this.springValue = new Animated.Value(0.3)

    this.state = {
      activeTab: 'upcoming',
    }
  }

  spring() {
    this.springValue.setValue(0.3)
    Animated.spring(
      this.springValue,
      {
        toValue: 1,
        friction: 1,
        tension: 1,
      }
    ).start()
  }

  tabStyle(viewType) {
    return viewType === this.state.activeTab ? styles.subnavHeaderActive : styles.subnavHeader
  }

  tabWrapperStyle(viewType) {
    return viewType === this.state.activeTab ? styles.activeWrapper : null
  }

  get ticketsForActiveView() {
    return this.props.screenProps.store.state.tickets[this.state.activeTab] || []
  }

  get emptyText() {
    return EMPTY_TEXT_FOR_ACTIVE_TAB[this.state.activeTab]
  }

  refreshTickets = async () => {
    await this.props.screenProps.store.userTickets()
    this.spring()
  }

  render() {
    const {
      navigation: {navigate},
      screenProps: {
        store: {setPurchasedTicket, state: {purchasedTicket}},
      }
    } = this.props

    return (
      <View style={styles.containerDark}>
        <NavigationEvents onWillFocus={this.refreshTickets} onDidBlur={() => setPurchasedTicket(null)} />
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
            <Text style={this.tabStyle('upcoming')} onPress={() => this.setState({activeTab: 'upcoming'})}>UPCOMING</Text>
          </View>
          <View style={this.tabWrapperStyle('past')}>
            <Text style={this.tabStyle('past')} onPress={() => this.setState({activeTab: 'past'})}>PAST</Text>
          </View>
          <View style={this.tabWrapperStyle('transfer')}>
            <Text style={this.tabStyle('transfer')} onPress={() => this.setState({activeTab: 'transfer'})}>TRANSFERS</Text>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.paddingHorizontal}>
            <TicketsView
              emptyText={this.emptyText}
              navigate={navigate}
              tickets={this.ticketsForActiveView}
              springValue={this.springValue}
              purchasedTicket={purchasedTicket}
              qrEnabled={this.state.activeTab === 'upcoming'}
            />
          </View>

          <View style={styles.spacer} />

        </ScrollView>
      </View>
    )
  }
}

MyTickets.propTypes = {
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
}
