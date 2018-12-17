import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {createStackNavigator} from 'react-navigation'
import {Subscribe} from 'unstated'
import {AuthContainer} from '../state/authStateProvider'
import {EventManagerContainer} from '../state/eventManagerStateProvider'
import AccountRoutes from '../Accounts/routes'
import {last} from 'lodash'

const AccountsStack = createStackNavigator({
  ...AccountRoutes,
}, {
  initialRouteName: 'Account',
})

export default class accountsStackWithStore extends Component {
  static router = AccountsStack.router;
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  // Hide bottom tab bar on any Event page that isnt the index
  static navigationOptions = ({navigation}) => {
    let tabBarVisible = true;
    const curRoute = last(navigation.state.routes)

    if (curRoute.routeName === 'EventScanner') {
      tabBarVisible = false;
    }

    return {
      tabBarVisible,
    };
  };

  render() {
    return (
      <Subscribe to={[AuthContainer, EventManagerContainer]}>
        {(auth, eventManager) => (
          <AccountsStack
            navigation={this.props.navigation}
            screenProps={{auth, eventManager}}
          />
        )}
      </Subscribe>
    )
  }
}
