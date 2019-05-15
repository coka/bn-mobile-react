import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Text, View, Image, TouchableHighlight} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import CheckoutStyles from '../styles/event_details/checkoutStyles'

const styles = SharedStyles.createStyles()
const checkoutStyles = CheckoutStyles.createStyles()

export default class PaymentTypes extends Component {
  static propTypes = {
    selectedPaymentId: PropTypes.number,
    paymentOptions: PropTypes.array,
    selectPayment: PropTypes.func,
  }

  get options() {
    const {paymentOptions, selectedPaymentId, selectPayment} = this.props

    /* eslint-disable-next-line complexity */
    return paymentOptions.map((payment) => {
      const selected = payment.id === selectedPaymentId
      const rightIcon = selected ? (
        <Icon style={checkoutStyles.iconCheck} name="check-circle" />
      ) : null

      return (
        <TouchableHighlight
          key={payment.id}
          onPress={() => selectPayment(payment.id)}
        >
          <View
            style={
              selected ?
                checkoutStyles.rowContainerActive :
                checkoutStyles.rowContainer
            }
          >
            <View style={checkoutStyles.row}>
              <Image style={checkoutStyles.iconPayment} source={payment.icon} />
              <View>
                <Text style={checkoutStyles.ticketHeader}>
                  {payment.header}
                </Text>
                <Text style={checkoutStyles.ticketSubHeader}>
                  {payment.subheader || null}
                </Text>
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
      <View style={checkoutStyles.mainBody}>
        <View style={checkoutStyles.mainBodyContent}>
          <View style={styles.container}>
            <Text style={checkoutStyles.header}>Payment Options</Text>
          </View>

          {this.options}

          <View style={[styles.buttonContainer, styles.paddingTop]}>
            <TouchableHighlight
              underlayColor="rgba(0, 0, 0, 0)"
              style={checkoutStyles.buttonRounded}
            >
              <Text style={styles.buttonSecondaryText}>
                Add New Payment Method
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}
