import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {createStackNavigator} from 'react-navigation'
import EventRoutes from '../Events/routes'
import {Subscribe} from 'unstated'
import {EventsContainer} from '../state/eventStateProvider'
import {TicketsContainer} from '../state/ticketStateProvider'
import {CartContainer} from '../state/cartStateProvider'
import {AuthContainer} from '../state/authStateProvider'

const EventsStack = createStackNavigator({
  ...EventRoutes,
}, {
  initialRouteName: 'Home',
  navigationOptions: {
    header: null,
  },
})

export default class eventStackWithStore extends Component {
  static router = EventsStack.router;
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  // Hide bottom tab bar on any Event page that isnt the index
  static navigationOptions = ({navigation}) => {
    let tabBarVisible = true;

    if (navigation.state.index > 0) {
      tabBarVisible = false;
    }

    return {
      tabBarVisible,
    };
  };

  render() {
    return (
      <Subscribe to={[EventsContainer, TicketsContainer, CartContainer, AuthContainer]}>
        {(eventStore, ticketStore, cartStore, authStore) => (
          <EventsStack
            navigation={this.props.navigation}
            screenProps={{
              store: eventStore,
              cart: cartStore,
              setPurchasedTicket: ticketStore.setPurchasedTicket,
              user: authStore.state,
            }}
          />
        )}
      </Subscribe>)
  }
}
