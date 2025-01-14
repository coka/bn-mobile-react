import React, { Component } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/MaterialIcons'
import emptyState from '../../assets/icon-empty-state.png'
import { SpinnerActivity } from '../constants/modals'
import { apiErrorAlert, server } from '../constants/Server'
import { price, usernameLastFirst } from '../string'
import AccountStyles from '../styles/account/accountStyles'
import DoormanStyles from '../styles/account/doormanStyles'
import EventDetailsStyles from '../styles/event_details/eventDetailsStyles'
import SharedStyles, {
  globalPaddingTiny,
  primaryColor,
} from '../styles/shared/sharedStyles'
import TicketStyles from '../styles/tickets/ticketStyles'
import { KeyboardDismisser } from '../ui'

const styles = SharedStyles.createStyles()
const doormanStyles = DoormanStyles.createStyles()
const accountStyles = AccountStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()
const eventDetailsStyles = EventDetailsStyles.createStyles()
const SCREEN_WIDTH = Dimensions.get('window').width

function shouldAllowCheckIn({ status, redeem_key }) {
  return status === 'Purchased' && redeem_key
}

function guestStatusBadgeStyle(status) {
  switch (status) {
    case 'Purchased':
      return doormanStyles.ticketPurchasedBadgeWrapper
    default:
      null
  }
}

function TicketStatusBadge({ status, style }) {
  return <Text style={doormanStyles.ticketStatusBadge}>{status}</Text>
}

function GuestRowContent({ guest }) {
  return (
    <View>
      <View style={doormanStyles.flexRowGuestList}>
        <Text numberOfLines={1} style={styles.headerSecondary}>
          {usernameLastFirst(guest)}
        </Text>
      </View>
      <Text style={doormanStyles.bodyText}>
        {price(guest.price_in_cents)} | {guest.ticket_type} |{' '}
        {guest.id.slice(guest.id.length - 8)}
      </Text>
    </View>
  )
}

function GuestFullNameContent({ guest }) {
  return (
    <View>
      <View style={doormanStyles.row}>
        <Text numberOfLines={1} style={styles.headerSecondary}>
          {usernameLastFirst(guest)}
        </Text>
      </View>
      <Text style={doormanStyles.bodyText}>
        {price(guest.price_in_cents)} | {guest.ticket_type} |{' '}
        {guest.id.slice(guest.id.length - 8)}
      </Text>
    </View>
  )
}

function GuestTicketCard({ guest, onSelect }) {
  return (
    <TouchableHighlight
      style={doormanStyles.rowContainer}
      underlayColor="rgba(0, 0, 0, 0)"
      onPress={() => onSelect(guest)}
    >
      <View style={doormanStyles.row}>
        <GuestRowContent guest={guest} />

        <View
          style={[
            doormanStyles.ticketStatusBadgeWrapper,
            guestStatusBadgeStyle(guest.status),
          ]}
        >
          <TicketStatusBadge status={guest.status} />
        </View>
        <Icon style={accountStyles.accountArrow} name="keyboard-arrow-right" />
      </View>
    </TouchableHighlight>
  )
}

function EmptyState() {
  return (
    <View style={ticketStyles.emptyStateContainer}>
      <Image style={ticketStyles.emptyStateIcon} source={emptyState} />
      <Text style={ticketStyles.emptyStateText}>No guests found.</Text>
    </View>
  )
}

function GuestTicketCardUnderlay({ guest }) {
  if (canCheckOut(guest)) {
    return (
      <View
        style={[
          eventDetailsStyles.checkInSwipeContainer,
          styles.marginLeftTiny,
        ]}
      >
        <Text style={eventDetailsStyles.checkInSwipeText}>
          Complete Check-In
        </Text>
      </View>
    )
  }

  return (
    <View
      style={[
        eventDetailsStyles.disabledCheckInSwipeContainer,
        styles.marginLeftTiny,
      ]}
    >
      <Text style={eventDetailsStyles.disabledCheckInSwipeText}>
        {checkInErrorText(guest)}
      </Text>
    </View>
  )
}

function canCheckOut(guest) {
  return guest.redeem_key && guest.status === 'Purchased'
}

function checkInErrorText(guest) {
  if (!guest.redeem_key) {
    return 'Check-in Disabled'
  }

  return 'Already checked-in'
}

class GuestList extends Component {
  // Calm down, eslint. Quit punishing us for handling errors. Geez.
  /* eslint-disable-next-line complexity */
  onRowOpen = async (rowKey, rowMap, toValue) => {
    const guest = this.props.guests.find((item) => item.id === rowKey)

    if (canCheckOut(guest) && toValue === SCREEN_WIDTH) {
      try {
        this.props.onCheckIn(guest)
      } catch (error) {
        apiErrorAlert(error)
      }
    }

    rowMap[rowKey].closeRow()
  }

  render() {
    const { guests, isFetchingPage, onSelect, onCheckIn, ...rest } = this.props

    if (guests.length === 0) {
      return <EmptyState />
    }

    return (
      <View>
        <SwipeListView
          {...rest}
          onScroll={() => Keyboard.dismiss()}
          useFlatList
          data={guests}
          keyExtractor={({ id }) => id}
          onRowOpen={this.onRowOpen}
          renderItem={({ item }) => (
            <SwipeRow
              disableLeftSwipe
              swipeToOpenPercent={40}
              leftOpenValue={SCREEN_WIDTH}
            >
              <GuestTicketCardUnderlay guest={item} />
              <GuestTicketCard guest={item} onSelect={onSelect} />
            </SwipeRow>
          )}
        />
        {isFetchingPage && (
          <ActivityIndicator
            color={primaryColor}
            style={{ paddingTop: globalPaddingTiny }}
          />
        )}
      </View>
    )
  }
}

function GuestToCheckIn({ guest, onCancel, onCheckIn }) {
  return (
    <View>
      <View style={doormanStyles.rowContainer}>
        <GuestFullNameContent guest={guest} style={doormanStyles.row} />
      </View>

      <View style={styles.container}>
        <View style={[styles.flexRowSpaceBetween, styles.paddingTop]}>
          <TouchableHighlight
            style={[eventDetailsStyles.buttonRounded, styles.marginRightTiny]}
            onPress={() => onCancel(guest)}
          >
            <Text style={eventDetailsStyles.buttonRoundedText}>
              Back to Guest List
            </Text>
          </TouchableHighlight>
          {shouldAllowCheckIn(guest) ? (
            <TouchableHighlight
              style={[
                eventDetailsStyles.buttonRoundedActive,
                styles.marginLeftTiny,
              ]}
              onPress={() => onCheckIn(guest)}
            >
              <Text style={eventDetailsStyles.buttonRoundedActiveText}>
                Complete Check-In
              </Text>
            </TouchableHighlight>
          ) : (
            <View
              style={[
                eventDetailsStyles.buttonRoundedActive,
                styles.marginLeftTiny,
              ]}
            >
              <Text style={eventDetailsStyles.buttonRoundedActiveText}>
                Already Checked-In
              </Text>
            </View>
          )}
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

export default class ManualCheckin extends Component {
  componentDidMount() {
    this.props.fetchGuestList()
  }

  unselectGuest = () => {
    this.props.selectGuest(null)
  }

  checkInGuest = async (guest) => {
    const { event_id, id: ticket_id, redeem_key } = guest

    try {
      this.props.updateGuestStatus(guest.id, 'processing')
      await server.events.tickets.redeem({ event_id, ticket_id, redeem_key })
    } catch (error) {
      apiErrorAlert(error)
    } finally {
      this.props.fetchGuestList()
      this.unselectGuest()
    }
  }

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 50
  }

  render() {
    const {
      fetchNextPage,
      guests,
      isFetchingGuests,
      isFetchingPage,
      guestListQuery,
      totalNumberOfGuests,
      selectedGuest,
      updateSearchQuery,
    } = this.props

    let guestText = totalNumberOfGuests === 1 ? 'guest' : 'guests'

    if (selectedGuest !== null) {
      return (
        <View style={doormanStyles.mainBody}>
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
      <KeyboardDismisser>
        <View style={[doormanStyles.mainBody, doormanStyles.checkoutMainBody]}>
          <View style={[doormanStyles.mainBodyContent]}>
            <View style={styles.container}>
              <Text style={doormanStyles.sectionHeader}>Guest List</Text>
              <Text
                style={doormanStyles.bodyText}
              >{`${totalNumberOfGuests} ${guestText}`}</Text>
              <View style={doormanStyles.searchContainer}>
                <TextInput
                  style={doormanStyles.searchInput}
                  onChangeText={(query) => updateSearchQuery(query)}
                  placeholder={'Search for guests'}
                  value={guestListQuery}
                />
              </View>
            </View>
            <ScrollView
              style={styles.flex1}
              scrollEventThrottle={16}
              onScroll={({ nativeEvent }) => {
                if (this.isCloseToBottom(nativeEvent)) {
                  fetchNextPage()
                }
              }}
            >
              {isFetchingGuests ? (
                <SpinnerActivity />
              ) : (
                <GuestList
                  guests={guests}
                  isFetchingPage={isFetchingPage}
                  onSelect={this.props.selectGuest}
                  onCheckIn={this.checkInGuest}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </KeyboardDismisser>
    )
  }
}
