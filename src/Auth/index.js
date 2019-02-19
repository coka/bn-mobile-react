import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Text, View, Image, TouchableHighlight} from 'react-native'
import {LinearGradient} from 'expo'
import LoginStyles from '../styles/login/loginStyles'

const loginStyles = LoginStyles.createStyles()

export default class AuthIndex extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={loginStyles.signupBkgdContainer}>
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
            <TouchableHighlight
              style={loginStyles.buttonContainer}
              underlayColor="rgba(0, 0, 0, 0)"
              onPress={() => this.props.navigation.navigate('SignUp')}
            >
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#5491CC', '#9A68B2', '#E53D96']}
                style={loginStyles.button}
              >
                <Text style={loginStyles.buttonText}>Get Started</Text>
              </LinearGradient>
            </TouchableHighlight>

            <View style={loginStyles.buttonContainer}>
              <TouchableHighlight
                underlayColor="rgba(0, 0, 0, 0)"
                onPress={() => this.props.navigation.navigate('LogIn')}
                style={loginStyles.buttonSecondary}
              >
                <Text style={loginStyles.buttonSecondaryText}>Login To Your Account</Text>
              </TouchableHighlight>
            </View>
          </View>

        </View>

      </View>
    )
  }
}
