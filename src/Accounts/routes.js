import React from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import Account from './index'
import AccountDetails from './account'
import Notifications from './notifications'
import Billing from './billing'
import OrderHistory from './orderHistory'
import SignedOut from './signedOut'
import EventManager from './eventManager'
import EventScanner from './eventScanner'
import Icon from 'react-native-vector-icons/MaterialIcons'
import NavigationStyles from '../styles/shared/navigationStyles'
import DoorEvent from './door-event'
import GuestList from './guest-list-screen'

const navigationStyles = NavigationStyles.createStyles()

function Back({ navigate, text, route }) {
  return (
    <TouchableHighlight
      underlayColor="rgba(0, 0, 0, 0)"
      onPress={() => navigate(route || 'Account')}
    >
      <View style={navigationStyles.headerLeftWrapper}>
        <Icon style={navigationStyles.backButton} name="keyboard-arrow-left" />
        <Text style={navigationStyles.headerLeftTitle}>
          {text || 'Settings'}
        </Text>
      </View>
    </TouchableHighlight>
  )
}

const STYLE_OPTIONS = {
  headerStyle: navigationStyles.navigationContainer,
  headerTitleStyle: navigationStyles.headerTitle,
  headerBackTitleStyle: navigationStyles.headerBackTitle,
}

function _configureNav({ navigate }, { title, back }) {
  const backProps = { ...(back || {}), navigate }

  return {
    title,
    headerLeft: <Back {...backProps} />,
    ...STYLE_OPTIONS,
  }
}

function navOptions(opts = {}) {
  return ({ navigation }) => _configureNav(navigation, opts)
}

function defaultNavOptions(title, navigation) {
  return _configureNav(navigation, { title })
}

function guestOptions(opts = {}) {
  const makeGuestOpts = (navigation, options) => {
    options.back.text = navigation.getParam('name', 'Event')
    return options
  }

  return ({ navigation }) =>
    _configureNav(navigation, makeGuestOpts(navigation, opts))
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
    navigationOptions: ({ navigation }) =>
      defaultNavOptions('Account', navigation),
  },
  SignedOut: {
    screen: SignedOut,
    navigationOptions: {
      title: 'Signed Out',
    },
  },
  Notifications: {
    screen: Notifications,
    navigationOptions: ({ navigation }) =>
      defaultNavOptions('Notifications', navigation),
  },
  Billing: {
    screen: Billing,
    navigationOptions: ({ navigation }) =>
      defaultNavOptions('Billing', navigation),
  },
  OrderHistory: {
    screen: OrderHistory,
    navigationOptions: ({ navigation }) =>
      defaultNavOptions('Order History', navigation),
  },
  ManageEvents: {
    screen: EventManager,
    navigationOptions: ({ navigation }) =>
      defaultNavOptions('Manage Events', navigation),
  },
  DoorEvent: {
    screen: DoorEvent,
    navigationOptions: navOptions({
      back: { route: 'ManageEvents', text: 'Manage Events' },
    }),
  },
  EventScanner: {
    screen: EventScanner,
    navigationOptions: {
      header: null,
    },
  },
  GuestList: {
    screen: GuestList,
    navigationOptions: guestOptions({
      back: { route: 'DoorEvent' },
    }),
  },
}

export default ROUTES
