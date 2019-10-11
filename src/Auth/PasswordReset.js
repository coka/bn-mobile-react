import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableHighlight,
  Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { LinearGradient } from 'expo-linear-gradient'
import SharedStyles from '../styles/shared/sharedStyles'
import FormStyles from '../styles/shared/formStyles'
import LoginStyles from '../styles/login/loginStyles'
import { server } from '../constants/Server'

const styles = SharedStyles.createStyles()
const formStyles = FormStyles.createStyles()
const loginStyles = LoginStyles.createStyles()

async function doPasswordReset(email) {
  return await server.passwordReset.create({ email })
}

export default class PasswordReset extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: props.navigation.state.params.defaultEmail,
    }
  }

  resetPassword = async () => {
    const { email } = this.state

    if (!email.match(/^[^@]+@[^@]+$/)) {
      Alert.alert('Error', 'Please enter a valid email address.')
      return
    }

    try {
      const {
        data: { message },
      } = await doPasswordReset(this.state.email)

      Alert.alert(message)
      this.props.navigation.navigate('LogIn')
    } catch (_error) {
      Alert.alert(
        'Error',
        'Something went wrong, and we could not reset your password.'
      )
    }
  }

  render() {
    return (
      <View style={loginStyles.container}>
        <View>
          <Text
            style={[
              styles.headerSecondary,
              styles.textCenter,
              styles.paddingBottomJumbo,
            ]}
          >
            Welcome back!
          </Text>
          <TextInput
            keyboardType="email-address"
            style={formStyles.input}
            placeholder="Email Address"
            searchIcon={{ size: 24 }}
            underlineColorAndroid="transparent"
            defaultValue={this.state.email}
            onChangeText={(email) => this.setState({ email })}
            autoCapitalize="none"
          />
        </View>
        <TouchableHighlight
          style={loginStyles.buttonContainer}
          onPress={this.resetPassword}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#5491CC', '#9A68B2', '#E53D96']}
            style={loginStyles.button}
          >
            <Text style={loginStyles.buttonText}>Reset your password</Text>
          </LinearGradient>
        </TouchableHighlight>
      </View>
    )
  }
}
