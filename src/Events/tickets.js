import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Text, View, TouchableHighlight, Image} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AccountStyles from '../styles/account/accountStyles'
import CheckoutStyles from '../styles/event_details/checkoutStyles'
import TicketStyles from '../styles/tickets/ticketStyles'
import emptyState from '../../assets/icon-empty-state.png'
import {toDollars} from '../constants/money'

const accountStyles = AccountStyles.createStyles()
const checkoutStyles = CheckoutStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()

/* eslint-disable camelcase, space-before-function-paren */

function ticketComparator({ticket_pricing: a}, {ticket_pricing: b}) {
  if (a === null && b == null) {
    return 0
  }
  if (a === null) {
    return 1
  }
  if (b === null) {
    return -1
  }
  return b - a
}

class Ticket extends Component {
  getOnPressHandler() {
    const {ticket, onTicketSelection} = this.props

    return ticket.ticket_pricing && (() => onTicketSelection(ticket.id, ticket.ticket_pricing.id))
  }

  get priceContent() {
    const {ticket_pricing} = this.props.ticket

    return ticket_pricing ? `$${toDollars(ticket_pricing.price_in_cents)}` : "N/A"
  }

  get subHeaderContent() {
    const {ticket_pricing} = this.props.ticket

    return ticket_pricing ? ticket_pricing.name : "SOLD OUT"
  }

  get icon() {
    return this.props.ticket.ticket_pricing && (
      <Icon style={accountStyles.accountArrow} name="keyboard-arrow-right" />
    )
  }

  render() {
    return (
      <TouchableHighlight key={this.props.ticket.id} onPress={this.getOnPressHandler()}>
        <View style={checkoutStyles.rowContainer}>
          <View style={checkoutStyles.row}>
            <Text style={checkoutStyles.ticketPrice}>{this.priceContent}</Text>
            <View>
              <Text style={checkoutStyles.ticketHeader}>{this.props.ticket.name}</Text>
              <Text style={checkoutStyles.ticketSubHeader}>{this.subHeaderContent}</Text>
            </View>
          </View>
          {this.icon}
        </View>
      </TouchableHighlight>
    )
  }
}

function NoAvailableTickets() {
  return (
    <View style={ticketStyles.emptyStateContainer}>
      <Image
        style={ticketStyles.emptyStateIcon}
        source={emptyState}
      />
      <Text style={ticketStyles.emptyStateText}>
        Looks like there are no tickets available at this time.
      </Text>
    </View>
  )
}

export default class GetTickets extends Component {
  static propTypes = {
    onTicketSelection: PropTypes.func,
    event: PropTypes.object,
  }

  get hasTickets() {
    return this.props.event.ticket_types.length > 0
  }

  get ticketList() {
    const {onTicketSelection, event: {ticket_types}} = this.props

    return ticket_types.sort(ticketComparator).map(ticket => (
      <Ticket key={ticket.id} ticket={ticket} onTicketSelection={onTicketSelection} />
    ))
  }

  render() {
    const hasTickets = this.props.event

    return (
      <View style={checkoutStyles.mainBody}>
        <View style={checkoutStyles.mainBodyContent}>

          {this.hasTickets ? (
            <View style={checkoutStyles.headerWrapper}>
              <Text style={checkoutStyles.header}>Ticket Type</Text>
            </View>
          ) : null}

          {this.hasTickets ? (
            this.ticketList
          ) : (
            <View style={ticketStyles.emptyStateContainer}>
              <Image
                style={ticketStyles.emptyStateIcon}
                source={emptyState}
              />
              <Text style={ticketStyles.emptyStateText}>
                Looks like there are no tickets available at this time.
              </Text>
            </View>
          )}

        </View>
      </View>
    )
  }
}
