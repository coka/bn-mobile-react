import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ActivityIndicator, StatusBar, View } from 'react-native'
import { Subscribe } from 'unstated'
import { AuthContainer } from '../state/authStateProvider'
import { retrieveTokens } from '../constants/Server'
import SharedStyles, { primaryColor } from '../styles/shared/sharedStyles'

const styles = SharedStyles.createStyles()

function shouldDoNextSignUpStep({ first_name: first, last_name: last }) {
  return !(first || last)
}

class AuthStore extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this._bootstrapAsync()
  }

  // Fetch the token from storage then navigate to our appropriate place
  // eslint-disable-next-line complexity
  _bootstrapAsync = async () => {
    // eslint-disable-line complexity,space-before-function-paren
    const {
      navigation: { navigate },
      auth,
    } = this.props

    try {
      const { userToken, refreshToken } = await retrieveTokens()

      if (userToken && refreshToken) {
        if (!auth.state.currentUser.user) {
          await auth.getCurrentUser(navigate, userToken, refreshToken)
        }
        if (!shouldDoNextSignUpStep(auth.state.currentUser.user)) {
          navigate('App')
        } else {
          navigate('SignUpNext')
        }
      } else {
        navigate('Auth')
      }
    } catch {
      navigate('Auth')
    }
  }

  render() {
    return (
      <View style={[styles.flex1, styles.flexRowCenter]}>
        <ActivityIndicator size="large" color={primaryColor} />
        <StatusBar barStyle="default" />
      </View>
    )
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
    )
  }
}
