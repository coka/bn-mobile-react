import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableHighlight,
} from 'react-native'
import { NavigationEvents } from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import AccountStyles from '../styles/account/accountStyles'
import BillingStyles from '../styles/account/billingStyles'
import OrderHistoryStyles from '../styles/account/orderHistoryStyles'
import { toDollars } from '../constants/money'
import { toMonthAndDate } from '../time'

const styles = SharedStyles.createStyles()
const accountStyles = AccountStyles.createStyles()
const billingStyles = BillingStyles.createStyles()
const orderHistoryStyles = OrderHistoryStyles.createStyles()

export default class OrderHistory extends Component {
  loadOrderHistory() {
    const {
      screenProps: { orderHistory },
    } = this.props

    if (orderHistory.orders.length === 0) {
      orderHistory.fetchOrderHistoryForUser()
    }
  }

  ticketQuantity(order) {
    return order.items
      .filter((item) => item.item_type === 'Tickets')
      .reduce((acc, item) => acc + item.quantity, 0)
  }

  ticketDescription(order) {
    const descriptions = order.items
      .filter((item) => item.item_type === 'Tickets')
      .map((item) => item.description.split(' - ')[0])

    if (descriptions.length === 0) {
      return 'N/A'
    } else if (descriptions.length === 1) {
      return descriptions[0]
    } else {
      return descriptions.toString()
    }
  }

  render() {
    const {
      screenProps: { orderHistory },
    } = this.props

    if (orderHistory.isFetching) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.containerDark}
        >
          <View style={styles.paddingVerticalMedium}>
            <Text style={accountStyles.sectionHeader}>
              Loading Order Receipts
            </Text>
          </View>
        </ScrollView>
      )
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.containerDark}
      >
        <NavigationEvents onDidFocus={() => this.loadOrderHistory()} />
        <View style={styles.paddingVerticalMedium}>
          <Text style={accountStyles.sectionHeader}>Order Receipts</Text>
          {orderHistory.orders.map((order) => {
            return (
              <View style={billingStyles.rowContainer} key={order.id}>
                <View style={orderHistoryStyles.row}>
                  <View style={orderHistoryStyles.dateWrapper}>
                    <Icon style={orderHistoryStyles.icon} name="assignment" />
                    <View>
                      <Text style={orderHistoryStyles.orderHistoryDate}>
                        {toMonthAndDate(order.paid_at)}
                      </Text>
                      <Text style={orderHistoryStyles.orderHistoryText}>
                        {this.ticketDescription(order)}
                      </Text>
                    </View>
                  </View>
                  <Text style={orderHistoryStyles.orderHistoryDate}>
                    X{this.ticketQuantity(order)}
                  </Text>
                  <Text style={orderHistoryStyles.orderHistoryText}>
                    ${toDollars(order.total_in_cents)} USD
                  </Text>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    )
  }
}
