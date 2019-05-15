import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {createStackNavigator} from 'react-navigation'
import LogInScreen from '../Auth/LogIn'
import SignUpScreen from '../Auth/SignUp'
import SignUpNext from '../Auth/SignUpNext'
import SignUpNotifications from '../Auth/SignUpNotifications'
import IndexScreen from '../Auth/index'
import {Subscribe} from 'unstated'
import {AuthContainer} from '../state/authStateProvider'
import {NetworkContainer} from '../state/networkStateProvider'
import PasswordReset from '../Auth/PasswordReset'

const AuthStack = createStackNavigator(
  {
    AuthRoot: IndexScreen,
    SignUp: SignUpScreen,
    SignUpNext,
    SignUpNotifications,
    LogIn: LogInScreen,
    PasswordReset,
  },
  {
    initialRouteName: 'AuthRoot',
  }
)

export default class authStackWithStore extends Component {
  static router = AuthStack.router
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  render() {
    return (
      <Subscribe to={[AuthContainer, NetworkContainer]}>
        {(auth, network) => (
          <AuthStack
            navigation={this.props.navigation}
            screenProps={{auth, network}}
          />
        )}
      </Subscribe>
    )
  }
}
