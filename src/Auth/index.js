import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, View, Image, TouchableHighlight } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { LinearGradient } from 'expo-linear-gradient'
import { LoadingScreen } from '../constants/modals'
import LoginStyles from '../styles/login/loginStyles'
import SharedStyles from '../styles/shared/sharedStyles'

const loginStyles = LoginStyles.createStyles()
const styles = SharedStyles.createStyles()

export default class AuthIndex extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      displayLoading: false,
    }
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
    this.setState({ displayLoading: false })
  }

  showModal = (displayLoading) => {
    // Don't setState on an unmounted component
    if (this.mounted) {
      this.setState({ displayLoading })
    }
  }

  render() {
    const { facebook } = this.props.screenProps.auth
    const { navigate } = this.props.navigation

    return (
      <View style={loginStyles.signupBkgdContainer}>
        <LoadingScreen visible={this.state.displayLoading} />
        <Image
          style={loginStyles.signupBkgd}
          source={require('../../assets/login-bkgd.png')}
        />

        <View style={loginStyles.section}>
          <Image
            style={loginStyles.logo}
            source={require('../../assets/big-neon-logo.png')}
          />
          <View>
            <View style={loginStyles.buttonContainer}>
              <TouchableHighlight
                underlayColor="rgba(0, 0, 0, 0)"
                onPress={() => facebook(navigate, this.showModal)}
                style={loginStyles.buttonFacebook}
              >
                <Text style={loginStyles.buttonText}>
                  Continue with Facebook
                </Text>
              </TouchableHighlight>
            </View>
            <TouchableHighlight
              style={loginStyles.buttonContainer}
              underlayColor="rgba(0, 0, 0, 0)"
              onPress={() => navigate('LogIn')}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#5491CC', '#9A68B2', '#E53D96']}
                style={loginStyles.button}
              >
                <Text style={loginStyles.buttonText}>Continue with email</Text>
              </LinearGradient>
            </TouchableHighlight>

            <View style={loginStyles.disclaimerWrapper}>
              <Text style={[loginStyles.mutedText, styles.textCenter]}>
                By continuing you agree to our
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableHighlight
                  onPress={() => {
                    WebBrowser.openBrowserAsync(
                      'https://www.bigneon.com/terms.html'
                    )
                  }}
                >
                  <Text
                    style={[
                      loginStyles.mutedText,
                      styles.textCenter,
                      styles.textUnderline,
                    ]}
                  >
                    Terms of Service
                  </Text>
                </TouchableHighlight>
                <Text style={loginStyles.mutedText}> &amp; </Text>
                <TouchableHighlight
                  onPress={() => {
                    WebBrowser.openBrowserAsync(
                      'https://www.bigneon.com/privacy.html'
                    )
                  }}
                >
                  <Text
                    style={[
                      loginStyles.mutedText,
                      styles.textCenter,
                      styles.textUnderline,
                    ]}
                  >
                    Privacy Policy
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
