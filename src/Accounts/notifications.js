import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import AccountStyles from '../styles/account/accountStyles'
import NotificationStyles from '../styles/account/notificationStyles'

const styles = SharedStyles.createStyles()
const accountStyles = AccountStyles.createStyles()
const notificationStyles = NotificationStyles.createStyles()

const notificationTypes = [
  {
    value: 'friend-interested',
    description: 'A friend is interested in an event',
    phone: false,
    email: true,
  },
  {
    value: 'dog-tickets',
    description: 'My dog buys tickets to a show',
    phone: false,
    email: false,
  },
  {
    value: 'artist-dislike',
    description: 'An artist i dislike cancels a show in my area',
    phone: true,
    email: false,
  },
  {
    value: 'sent-ticket',
    description: 'Someone sends me a ticket',
    phone: true,
    email: true,
  },
]

const NotificationType = ({ value, text, state, onToggle }) => (
  <View style={notificationStyles.notificationRow}>
    <View style={styles.cols2}>
      <Text style={accountStyles.accountHeader}>{text}</Text>
    </View>
    <TouchableHighlight
      underlayColor="rgba(0, 0, 0, 0)"
      onPress={() => onToggle(value, 'phone', !state.phone)}
    >
      <Icon
        style={
          state.phone
            ? accountStyles.accountIconActive
            : accountStyles.accountIcon
        }
        name="phone-iphone"
      />
    </TouchableHighlight>
    <TouchableHighlight
      underlayColor="rgba(0, 0, 0, 0)"
      onPress={() => onToggle(value, 'email', !state.email)}
    >
      <Icon
        style={
          state.email
            ? accountStyles.accountIconActive
            : accountStyles.accountIcon
        }
        name="mail-outline"
      />
    </TouchableHighlight>
  </View>
)

export default class Notifications extends Component {
  constructor(props) {
    super(props)

    this.state = {
      types: [],
    }
  }

  componentWillMount() {
    this.setCurrentNotifications()
  }

  setCurrentNotifications() {
    notificationTypes.forEach((notType) => {
      const { value, phone, email } = notType

      this.setState({ [value]: { phone, email } })
    })
  }

  changeNotification = (notValue, notMethod, setting) => {
    const oldSetting = this.state[notValue]

    this.setState({
      [notValue]: { ...oldSetting, [notMethod]: setting },
    })
  }

  get notificationSettings() {
    return notificationTypes.map((notification, index) => (
      <NotificationType
        key={index}
        value={notification.value}
        text={notification.description}
        state={this.state[notification.value]}
        onToggle={this.changeNotification}
      />
    ))
  }

  render() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.containerDark}
      >
        <View style={styles.paddingVerticalMedium}>
          <View style={notificationStyles.notificationHeaderRow}>
            <View style={styles.cols2}>
              <Text style={notificationStyles.sectionHeader}>
                Notification Type
              </Text>
            </View>
            <Text style={notificationStyles.sectionHeader}>Phone</Text>
            <Text style={notificationStyles.sectionHeader}>Email</Text>
          </View>

          {this.notificationSettings}
        </View>
      </ScrollView>
    )
  }
}
