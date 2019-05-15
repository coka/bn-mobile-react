import React, {Component} from 'react'
import {View, TouchableHighlight, Text} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {NavigationEvents} from 'react-navigation'
import {server, apiErrorAlert} from '../constants/Server'
import SharedStyles from '../styles/shared/sharedStyles'
import EventManagerStyles from '../styles/account/eventManagerStyles'

const styles = SharedStyles.createStyles()
const eventManagerStyles = EventManagerStyles.createStyles()

function HeaderText({children}) {
  return (
    <Text style={[styles.headerSecondary, styles.textCenter]}>{children}</Text>
  )
}

function ScanButton({onPress}) {
  return (
    <View style={[styles.buttonContainer, styles.marginVertical]}>
      <TouchableHighlight
        style={eventManagerStyles.buttonScanTicket}
        underlayColor="#F5F6F7"
        onPress={onPress}
      >
        <View style={styles.buttonIconContainer}>
          <Icon
            style={eventManagerStyles.buttonScanIcon}
            name="filter-center-focus"
          />
          <Text style={eventManagerStyles.buttonScanTicketText}>
            Scan Tickets
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  )
}

function DoorEventDashboard({
  event: {tickets_redeemed: redeemed, sold_held: sold1, sold_unreserved: sold2},
}) {
  return (
    <View>
      <HeaderText>
        {redeemed} of {sold1 + sold2} redeemed
      </HeaderText>
    </View>
  )
}

function DoorEventSummary({event: {name}, dashboard, onPressScan}) {
  return (
    <View>
      <HeaderText>{name}</HeaderText>
      <ScanButton onPress={onPressScan} />
      {dashboard && <DoorEventDashboard {...dashboard} />}
    </View>
  )
}

export default class DoorEvent extends Component {
  state = {
    dashboardResponse: null,
  }

  get event() {
    return this.props.navigation.getParam('event')
  }

  get dashboardResponse() {
    return this.state.dashboardResponse
  }

  get dashboardData() {
    return this.dashboardResponse && this.dashboardResponse.data
  }

  reload = async() => {
    const {id} = this.event

    this.setState({dashboardResponse: null})
    try {
      const dashboardResponse = await server.events.dashboard({id})

      this.setState({dashboardResponse})
    } catch (error) {
      apiErrorAlert(error)
    }
  }

  chooseEvent = async() => {
    await this.props.screenProps.eventManager.scanForEvent(this.event)
    this.props.navigation.navigate('EventScanner')
  }

  render() {
    return (
      <View style={styles.containerFullHeight}>
        <NavigationEvents onDidFocus={this.reload} />
        <DoorEventSummary
          event={this.event}
          dashboard={this.dashboardData}
          onPressScan={this.chooseEvent}
        />
      </View>
    )
  }
}
