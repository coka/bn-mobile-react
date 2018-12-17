import React from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import Account from './index'
import AccountDetails from './account'
import Notifications from './notifications'
import Billing from './billing'
import OrderHistory from './orderHistory'
import SignedOut from './signedOut'
import ChangePhoto from './changePhoto'
import EventManager from './eventManager'
import EventScanner from './eventScanner'
import Icon from 'react-native-vector-icons/MaterialIcons'
import NavigationStyles from '../styles/shared/navigationStyles'

const navigationStyles = NavigationStyles.createStyles()

const returnToSettings = (navigation) => (
  <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={() => navigation.navigate('Account')}>
    <View style={navigationStyles.headerLeftWrapper}>
      <Icon style={navigationStyles.backButton} name="keyboard-arrow-left" />
      <Text style={navigationStyles.headerLeftTitle}>Settings</Text>
    </View>
  </TouchableHighlight>
)

const defaultNavOptions = (title, navigation) => {
  return {
    title,
    headerLeft: returnToSettings(navigation),
    headerStyle: navigationStyles.navigationContainer,
    headerTitleStyle: navigationStyles.headerTitle,
    headerBackTitleStyle: navigationStyles.headerBackTitle,
  }
}

const ROUTES = {
  Account: {
    screen: Account,
    navigationOptions: {
      header: null,
    },
  },
  AccountDetails: {
    screen: AccountDetails,
    navigationOptions: ({navigation}) => (defaultNavOptions('Account', navigation)),
  },
  ChangePhoto: {
    screen: ChangePhoto,
    navigationOptions: {
      title: 'Change Photo',
    },
  },
  SignedOut: {
    screen: SignedOut,
    navigationOptions: {
      title: 'Signed Out',
    },
  },
  Notifications: {
    screen: Notifications,
    navigationOptions: ({navigation}) => (defaultNavOptions('Notifications', navigation)),
  },
  Billing: {
    screen: Billing,
    navigationOptions: ({navigation}) => (defaultNavOptions('Billing', navigation)),
  },
  OrderHistory: {
    screen: OrderHistory,
    navigationOptions: ({navigation}) => (defaultNavOptions('Order History', navigation)),
  },
  ManageEvents: {
    screen: EventManager,
    navigationOptions: ({navigation}) => (defaultNavOptions('My Events', navigation)),
  },
  EventScanner: {
    screen: EventScanner,
    navigationOptions: {
      header: null,
    },
  },
}

export default ROUTES
