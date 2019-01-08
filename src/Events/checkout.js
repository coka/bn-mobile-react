import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Text, View, Image, TouchableHighlight} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import AccountStyles from '../styles/account/accountStyles'
import CheckoutStyles from '../styles/event_details/checkoutStyles'
import {eventDateTimes} from '../time'
import {isEmpty, includes} from 'lodash'
import {toDollars} from '../constants/money'

const styles = SharedStyles.createStyles()
const accountStyles = AccountStyles.createStyles()
const checkoutStyles = CheckoutStyles.createStyles()

/*  eslint-disable camelcase */

function ChangeQuantityButton({icon, enabledStyle, disabledStyle, onPress, enabled}) {
  return (
    <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={enabled ? onPress : null}>
      <Icon style={enabled ? enabledStyle : disabledStyle} name={icon} />
    </TouchableHighlight>
  )
}

export default class Checkout extends Component {
  static propTypes = {
    changeScreen: PropTypes.func,
    event: PropTypes.object,
    cart: PropTypes.object,
  }

  createQuantityButton(diff, icon) {
    return (
      <ChangeQuantityButton
        enabled={this.props.cart.canAddQuantity(diff)}
        onPress={() => this.props.cart.addQuantity(diff)}
        icon={icon}
        enabledStyle={checkoutStyles.removeIcon}
        disabledStyle={checkoutStyles.removeIconDisabled}
      />
    )
  }

  get incrementButton() {
    return this.createQuantityButton(1, 'add-circle')
  }

  get decrementButton() {
    return this.createQuantityButton(-1, 'remove-circle')
  }

  get ticketType() {
    return this.props.event.ticket_types.find(({id}) => id === this.props.cart.selectedTicket.ticket_type_id)
  }

  get paymentSelected() {
    const {cart: {payment}} = this.props

    if (payment) {
      return (
        <View style={styles.flexRowFlexStart}>
          <Image
            style={checkoutStyles.iconPaymentSmall}
            source={require('../../assets/icon-visa-pay.png')}
          />
          <Text style={checkoutStyles.ticketSubHeaderPink}>**** **** **** {payment.last4}</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.flexRowFlexStart}>
          <Text style={checkoutStyles.ticketSubHeaderPink}>Please enter your payment information</Text>
        </View>
      )
    }
  }

  render() {
    const {event, cart} = this.props
    const eventTime = eventDateTimes(event).event_start

    return (
      <View style={[checkoutStyles.mainBody, checkoutStyles.checkoutMainBody]}>
        <View style={checkoutStyles.mainBodyContent}>

          <View style={checkoutStyles.headerWrapper}>
            <Text style={checkoutStyles.header}>Checkout</Text>
          </View>

          <View style={checkoutStyles.rowContainer}>
            <View style={checkoutStyles.row}>
              <View>
                <Text style={[checkoutStyles.ticketHeader, styles.marginBottomTiny]}>Quantity</Text>
                <Text style={checkoutStyles.ticketSubHeader}>{this.ticketType.name}</Text>
              </View>
            </View>
            <View style={checkoutStyles.row}>
              {this.decrementButton}
              <Text style={checkoutStyles.quantityPrice}>{cart.requestedQuantity}</Text>
              {this.incrementButton}
            </View>
          </View>

          <View style={checkoutStyles.rowContainer}>
            <View style={checkoutStyles.row}>
              <View>
                <Text style={[checkoutStyles.ticketHeader, styles.marginBottomTiny]}>{event.name}</Text>
                <Text style={checkoutStyles.ticketSubHeader}>{eventTime.toFormat('cccc LLLL d')} - {eventTime.toFormat('h:mm a')} - {event.venue.name}</Text>
              </View>
            </View>
          </View>

          <TouchableHighlight onPress={() => this.props.changeScreen('payment')}>
            <View style={checkoutStyles.rowContainer}>
              <View style={checkoutStyles.row}>
                <View>
                  <Text style={[checkoutStyles.ticketHeader, styles.marginBottomTiny]}>Payment</Text>
                  {this.paymentSelected}
                </View>
              </View>
              <Icon style={accountStyles.accountArrow} name="keyboard-arrow-right" />
            </View>
          </TouchableHighlight>

          <View style={checkoutStyles.rowContainer}>
            <View style={checkoutStyles.row}>
              <View>
                <Text style={[checkoutStyles.ticketHeader, styles.marginBottomTiny]}>Sub Total</Text>
                <Text style={checkoutStyles.ticketHeader}>Fees</Text>
              </View>
            </View>
            <View style={checkoutStyles.row}>
              <View>
                <Text style={[checkoutStyles.ticketSubHeader, styles.marginBottomSmall]}>${toDollars(cart.ticketsCents)} USD</Text>
                <Text style={checkoutStyles.ticketSubHeader}>${toDollars(cart.feesCents)} USD</Text>
              </View>
            </View>
          </View>

          <View style={checkoutStyles.rowContainer}>
            <View style={checkoutStyles.row}>
              <View>
                <Text style={checkoutStyles.ticketHeader}>Total</Text>
              </View>
            </View>
            <View style={checkoutStyles.row}>
              <View>
                <Text style={checkoutStyles.ticketHeader}>${toDollars(cart.totalCents)} USD</Text>
              </View>
            </View>
          </View>

        </View>
      </View>
    )
  }
}
