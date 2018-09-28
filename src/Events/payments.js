import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Text, View, Image, TouchableHighlight} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import AccountStyles from '../styles/account/accountStyles'
import EventTicketStyles from '../styles/event_details/eventTicketStyles'

const styles = SharedStyles.createStyles()
const accountStyles = AccountStyles.createStyles()
const eventTicketStyles = EventTicketStyles.createStyles()

export default class PaymentTypes extends Component {
  static propTypes = {
    selectedPaymentId: PropTypes.number,
    paymentOptions: PropTypes.array,
    selectPayment: PropTypes.func,
  }

  get options() {
    const {paymentOptions, selectedPaymentId, selectPayment} = this.props

    return paymentOptions.map((payment) => {
      const selected = payment.id === selectedPaymentId
      const rightIcon = selected ?
        null : // @ Brittany - selected icon goes here
        <Icon style={accountStyles.accountArrow} name="keyboard-arrow-right" />

      return (
        <TouchableHighlight key={payment.id} onPress={() => selectPayment(payment.id)}>
          <View style={eventTicketStyles.rowContainer}>
            <View style={eventTicketStyles.row}>
              <Image
                style={eventTicketStyles.iconPayment}
                source={payment.icon}
              />
              <View>
                <Text style={eventTicketStyles.ticketHeader}>{payment.header}</Text>
                <Text style={eventTicketStyles.ticketSubHeader}>{payment.subheader || null}</Text>
              </View>
            </View>

            {rightIcon}
          </View>
        </TouchableHighlight>
      )
    })
  }

  render() {
    return (
      <View style={eventTicketStyles.mainBody}>

        <View style={styles.container}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.header}>Payment Options</Text>
          </View>
        </View>

        {this.options}

        <View style={[styles.buttonContainer, styles.paddingTop]}>
          <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" style={eventTicketStyles.buttonRounded}>
            <Text style={[styles.buttonSecondaryText, styles.textCenter]}>Add New Payment Method</Text>
          </TouchableHighlight>
        </View>

      </View>
    )
  }
}
