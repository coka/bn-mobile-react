import React, {Component} from 'react'
import {ScrollView, View, Text, TouchableHighlight, TextInput, Image, FlatList, StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {price, username, usernameLastFirst} from '../string'
import SharedStyles from '../styles/shared/sharedStyles'
import DoormanStyles from '../styles/account/doormanStyles'
import AccountStyles from '../styles/account/accountStyles'
import TicketStyles from '../styles/tickets/ticketStyles'
import EventDetailsStyles from '../styles/event_details/eventDetailsStyles'
import {server, apiErrorAlert} from '../constants/Server'

const styles = SharedStyles.createStyles()
const doormanStyles = DoormanStyles.createStyles()
const accountStyles = AccountStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()
const eventDetailsStyles = EventDetailsStyles.createStyles()

function shouldAllowCheckIn({status, redeem_key}) {
  return status === 'Purchased' && redeem_key
}

function BusyState() {
  return (
    <View style={ticketStyles.emptyStateContainer}>
      <Text style={ticketStyles.emptyStateText}>Hang on a sec...</Text>
    </View>
  )
}

function guestStatusBadgeStyle(status) {
  switch (status) {
  case 'Purchased':
    return doormanStyles.ticketPurchasedBadgeWrapper
  default:
    null
  }
}

function TicketStatusBadge({status, style}) {
  return (
    <Text style={doormanStyles.ticketStatusBadge}>{status}</Text>
  )
}

function GuestRowContent({guest}) {
  return (
    <View>
      <View style={styles.flexRowSpaceBetween}>
        <Text numberOfLines={1} style={styles.headerSecondary}>{usernameLastFirst(guest)}</Text>
        <View style={[doormanStyles.ticketStatusBadgeWrapper, guestStatusBadgeStyle(guest.status)]}>
          <TicketStatusBadge status={guest.status} />
        </View>
      </View>
      <Text style={doormanStyles.bodyText}>{price(guest.price_in_cents)} | {guest.ticket_type}</Text>
    </View>
  )
}

function GuestTicketCard({guest, onSelect}) {
  return (
    <View style={doormanStyles.rowContainer}>
      <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={() => onSelect(guest)}>
        <View style={doormanStyles.row}>
          <GuestRowContent guest={guest} />
          <Icon style={accountStyles.accountArrow} name="keyboard-arrow-right" />
        </View>
      </TouchableHighlight>
    </View>
  )
}

function EmptyState() {
  return (
    <Text>No guests found.</Text>
  )
}

function GuestList({guests, onSelect, ...rest}) {
  if (guests.length === 0) {
    return <EmptyState />
  }

  return (
    <FlatList
      {...rest}
      data={guests}
      keyExtractor={({id}) => id}
      renderItem={({item}) => (
        <GuestTicketCard
          guest={item}
          onSelect={onSelect}
        />
      )}
    />
  )
}

function GuestToCheckIn({guest, onCancel, onCheckIn}) {
  return (
    <View>
      <View style={doormanStyles.rowContainer}>
        <GuestRowContent guest={guest} />
      </View>

      <View style={styles.container}>
        <View style={[styles.flexRowSpaceBetween, styles.paddingTop]}>
          <TouchableHighlight
            style={[eventDetailsStyles.buttonRounded, styles.marginRightTiny]}
            onPress={() => onCancel(guest)}
          >
            <Text style={eventDetailsStyles.buttonRoundedText}>Back to List</Text>
          </TouchableHighlight>
          {shouldAllowCheckIn(guest) ? (
            <TouchableHighlight
              style={[eventDetailsStyles.buttonRoundedActive, styles.marginLeftTiny]}
              onPress={() => onCheckIn(guest)}
            >
              <Text style={eventDetailsStyles.buttonRoundedActiveText}>Complete Check-In</Text>
            </TouchableHighlight>
          ) : null}
        </View>
        <View style={[styles.flexRowSpaceBetween, styles.paddingTop]}>
          {guest.redeem_key ? null : (
            <Text>Missing redeem key. Cannot check in at this time.</Text>
          )}
        </View>
      </View>

    </View>
  )
}

function SearchBox({textInput}) {
  return (
    <TextInput {...textInput} />
  )
}

export default class ManualCheckin extends Component {
  state = {
    selectedGuest: null,
  }

  componentDidMount() {
    this.searchGuestList()
  }

  searchGuestList = (query) => {
    this.props.searchGuestList(query)
  }

  selectGuest = (selectedGuest) => {
    this.setState({selectedGuest})
  }

  unselectGuest = () => {
    this.selectGuest(null)
  }

  checkInGuest = async (guest) => {
    const {event_id, id: ticket_id, redeem_key} = guest

    try {
      await server.events.tickets.redeem({event_id, ticket_id, redeem_key})
      alert(`Checked in ${username(guest)}`)
    } catch (error) {
      apiErrorAlert(error)
    } finally {
      this.searchGuestList()
      this.unselectGuest()
    }
  }

  render() {
    const {selectedGuest} = this.state
    const {isFetchingGuests, guests, guestListQuery} = this.props

    if (selectedGuest !== null) {
      return (
        <View style={[doormanStyles.mainBody, doormanStyles.checkoutMainBody]}>
          <View style={doormanStyles.mainBodyContent}>
            <GuestToCheckIn
              guest={selectedGuest}
              onCancel={this.unselectGuest}
              onCheckIn={this.checkInGuest}
            />
          </View>
        </View>
      )
    }

    return (
      <View style={[doormanStyles.mainBody, doormanStyles.checkoutMainBody]}>
        <View style={[doormanStyles.mainBodyContent]}>

          <View style={styles.container}>
            <Text style={doormanStyles.sectionHeader}>All Guests</Text>
            <View style={doormanStyles.searchContainer}>
              <SearchBox
                textInput={{
                  defaultValue: guestListQuery,
                  onChangeText: this.searchGuestList,
                  placeholder: "Search for guests",
                }}
                style={doormanStyles.searchInput}
              />
            </View>
          </View>

          {isFetchingGuests && (
            <BusyState />
          )}

          <GuestList
            style={{flex: 1}}
            guests={guests}
            onSelect={this.selectGuest}
          />
          <View style={doormanStyles.spacer} />

        </View>
      </View>
    )
  }
}
