import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
  ActivityIndicator,
  StatusBar,
  View,
} from 'react-native';
import {Subscribe} from 'unstated'
import {AuthContainer} from '../state/authStateProvider'
import {retrieveTokens} from '../constants/Server'

class AuthStore extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => { // eslint-disable-line complexity,space-before-function-paren
    const {navigation: {navigate}, auth} = this.props
    const {userToken, refreshToken} = await retrieveTokens()

    if (userToken && refreshToken) {
      const {state: {currentUser}} = auth

      if (Object.keys(currentUser).length === 0) {
        await auth.getCurrentUser(navigate, userToken, refreshToken)
      }

      navigate('App')
    } else {
      navigate('Auth')
    }
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default class AuthLoadingScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  // Render any loading content that you like here
  render() {
    return (
      <Subscribe to={[AuthContainer]}>
        {(auth) => <AuthStore auth={auth} navigation={this.props.navigation} />}
      </Subscribe>
    );
  }
}
