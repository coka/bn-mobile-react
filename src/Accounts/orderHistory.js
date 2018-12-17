import React from 'react';
import {Text, View, Image, TextInput, ScrollView, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import AccountStyles from '../styles/account/accountStyles'
import BillingStyles from '../styles/account/billingStyles'
import OrderHistoryStyles from '../styles/account/orderHistoryStyles'

const styles = SharedStyles.createStyles()
const accountStyles = AccountStyles.createStyles()
const billingStyles = BillingStyles.createStyles()
const orderHistoryStyles = OrderHistoryStyles.createStyles()

export default function OrderHistory() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.containerDark}>
      <View style={styles.paddingVerticalMedium}>

        <Text style={accountStyles.sectionHeader}>Order Receipts</Text>

        <View style={billingStyles.rowContainer}>
          <View style={orderHistoryStyles.row}>

            <View style={orderHistoryStyles.dateWrapper}>
              <Icon style={orderHistoryStyles.icon} name="assignment" />
              <View>
                <Text style={orderHistoryStyles.orderHistoryDate}>AUG 14TH | THE WARFIELD</Text>
                <Text style={orderHistoryStyles.orderHistoryText}>Future Islands</Text>
              </View>
            </View>
            <Text style={orderHistoryStyles.orderHistoryDate}>X3</Text>
            <Text style={orderHistoryStyles.orderHistoryText}>$99.99</Text>

          </View>
        </View>

        <View style={billingStyles.rowContainer}>
          <View style={orderHistoryStyles.row}>

            <View style={orderHistoryStyles.dateWrapper}>
              <Icon style={orderHistoryStyles.icon} name="assignment" />
              <View>
                <Text style={orderHistoryStyles.orderHistoryDate}>AUG 14TH | THE WARFIELD</Text>
                <Text style={orderHistoryStyles.orderHistoryText}>Future Islands</Text>
              </View>
            </View>
            <Text style={orderHistoryStyles.orderHistoryDate}>X3</Text>
            <Text style={orderHistoryStyles.orderHistoryText}>$99.99</Text>

          </View>
        </View>

        <View style={billingStyles.rowContainer}>
          <View style={orderHistoryStyles.row}>

            <View style={orderHistoryStyles.dateWrapper}>
              <Icon style={orderHistoryStyles.icon} name="assignment" />
              <View>
                <Text style={orderHistoryStyles.orderHistoryDate}>AUG 14TH | THE WARFIELD</Text>
                <Text style={orderHistoryStyles.orderHistoryText}>Future Islands</Text>
              </View>
            </View>
            <Text style={orderHistoryStyles.orderHistoryDate}>X3</Text>
            <Text style={orderHistoryStyles.orderHistoryText}>$99.99</Text>

          </View>
        </View>

        <View style={billingStyles.rowContainer}>
          <View style={orderHistoryStyles.row}>

            <View style={orderHistoryStyles.dateWrapper}>
              <Icon style={orderHistoryStyles.icon} name="assignment" />
              <View>
                <Text style={orderHistoryStyles.orderHistoryDate}>AUG 14TH | THE WARFIELD</Text>
                <Text style={orderHistoryStyles.orderHistoryText}>Future Islands</Text>
              </View>
            </View>
            <Text style={orderHistoryStyles.orderHistoryDate}>X3</Text>
            <Text style={orderHistoryStyles.orderHistoryText}>$99.99</Text>

          </View>
        </View>

      </View>
    </ScrollView>
  );
}
