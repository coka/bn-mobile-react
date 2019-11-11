import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { createStackNavigator } from 'react-navigation'
import { Subscribe } from 'unstated'
import { AuthContainer } from '../state/authStateProvider'
import { NetworkContainer } from '../state/networkStateProvider'
import { TicketsContainer } from '../state/ticketStateProvider'
import TicketTransfersContainer from '../state/ticketTransfersStateProvider'
import { MAIN_ROUTES, MODAL_ROUTES } from '../Tickets/routes'

const TicketsStack = createStackNavigator(
  {
    ...MAIN_ROUTES,
  },
  {
    initialRouteName: 'MyTicketList',
    navigationOptions: {
      header: null,
    },
  }
)

const FullTicketStack = createStackNavigator(
  {
    Main: {
      screen: TicketsStack,
    },
    ...MODAL_ROUTES,
  },
  {
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: {
      header: null,
    },
  }
)

export default class ticketStackWithStore extends Component {
  static router = FullTicketStack.router
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = ({ navigation }) => {
    let tabBarVisible = true

    if (navigation.state.index > 0) {
      tabBarVisible = false
    }

    return {
      tabBarVisible,
    }
  }

  render() {
    return (
      <Subscribe
        to={[
          TicketsContainer,
          TicketTransfersContainer,
          AuthContainer,
          NetworkContainer,
        ]}
      >
        {(ticketStore, transfers, authStore, network) => (
          <FullTicketStack
            navigation={this.props.navigation}
            screenProps={{
              store: ticketStore,
              transfers,
              auth: authStore,
              network,
            }}
          />
        )}
      </Subscribe>
    )
  }
}
