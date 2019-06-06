import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Text, View, TouchableHighlight} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AccountStyles from '../styles/account/accountStyles'
import CheckoutStyles from '../styles/event_details/checkoutStyles'
import TicketStyles from '../styles/tickets/ticketStyles'
import {toDollars} from '../constants/money'

const accountStyles = AccountStyles.createStyles()
const checkoutStyles = CheckoutStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()

/* eslint-disable camelcase */

export class Ticket extends Component {
  static propTypes = {
    ticket: PropTypes.object.isRequired,
    onTicketSelection: PropTypes.func.isRequired,
  }

  getOnPressHandler(isSoldOut) {
    if (isSoldOut) {
      return () => {}
    }

    const {ticket, onTicketSelection} = this.props

    return ticket.ticket_pricing && (() => onTicketSelection(ticket))
  }

  get priceContent() {
    const {status, ticket_pricing} = this.props.ticket
    switch (status) {
    case 'SoldOut':
      return 'SOLD OUT'
    default:
      return ticket_pricing ?
        `$${toDollars(
          ticket_pricing.price_in_cents - ticket_pricing.discount_in_cents,
          0
        )}` :
        'N/A'
    }
  }

  get subHeaderContent() {
    const {description, status, ticket_pricing} = this.props.ticket

    switch (status) {
    case 'SoldOut':
      return 'SOLD OUT'
    case 'Published':
      return description ? description : ticket_pricing.name
    default:
      return null
    }
  }

  get icon() {
    return (
      this.props.ticket.ticket_pricing && (
        <Icon style={accountStyles.accountArrow} name="keyboard-arrow-right" />
      )
    )
  }

  render() {
    const price = this.priceContent
    const isSoldOut = price === 'SOLD OUT'

    return (
      <TouchableHighlight
        key={this.props.ticket.id}
        onPress={this.getOnPressHandler(isSoldOut)}
      >
        <View style={checkoutStyles.rowContainer}>
          <View style={[checkoutStyles.row, ticketStyles.ticketHolderWrapper]}>
            <Text
              style={
                isSoldOut ?
                  checkoutStyles.soldOutTicketPrice :
                  checkoutStyles.ticketPrice
              }
            >
              {price}
            </Text>
            <View style={[ticketStyles.ticketHolderWrapper]}>
              <Text style={checkoutStyles.ticketHeader}>
                {this.props.ticket.name}
              </Text>
              <Text style={checkoutStyles.ticketSubHeader}>
                {this.subHeaderContent}
              </Text>
            </View>
          </View>
          {isSoldOut ? null : this.icon}
        </View>
      </TouchableHighlight>
    )
  }
}
