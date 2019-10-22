import { openBrowserAsync } from 'expo-web-browser'
import React, { Component } from 'react'
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import Button from '../components/Button'
import { default as Input } from '../components/Input'
import Link from '../components/Link'
import { server } from '../constants/Server'
import { colors, fonts } from '../styles/shared/sharedStyles'

async function doPasswordReset(email) {
  return await server.passwordReset.create({ email })
}

export default class PasswordReset extends Component {
  static navigationOptions = {
    header: null,
  }

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
    const { navigation } = this.props
    const { email } = this.state

    return (
      <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
        <View style={customStyles.container}>
          <View>
            <View>
              <Text style={customStyles.title}>Forgot password?</Text>
              <TouchableHighlight
                style={customStyles.x}
                onPress={() => navigation.goBack()}
                underlayColor="none"
              >
                <Image
                  style={{ width: 16, height: 16 }}
                  source={require('../../assets/x.png')}
                />
              </TouchableHighlight>
            </View>
            <Text style={customStyles.helperText}>
              No prob! Enter your email address to recieve your password reset
              instructions.
            </Text>
            <Input
              keyboardType="email-address"
              onChangeText={(email) => this.setState({ email })}
              placeholder="Email Address"
              value={email}
            />
            <View style={customStyles.buttonContainer}>
              <Button
                disabled={!email}
                label="Reset Password"
                onPress={this.resetPassword}
              />
            </View>
          </View>
          <View>
            <Text style={customStyles.footer}>
              Need help?{' '}
              <Link
                onPress={() =>
                  openBrowserAsync('https://support.bigneon.com/hc/en-us')
                }
              >
                Contact Support
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const customStyles = StyleSheet.create({
  buttonContainer: {
    marginTop: 14,
  },
  container: {
    height: Dimensions.get('window').height,
    justifyContent: 'space-between',
    paddingBottom: 33,
    paddingHorizontal: 20,
    paddingTop: 44,
  },
  footer: {
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 15,
    textAlign: 'center',
  },
  helperText: {
    color: '#9da3b4',
    fontFamily: fonts.medium,
    fontSize: 17,
    lineHeight: 18,
    marginBottom: 39,
    textAlign: 'center',
  },
  title: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 17,
    marginBottom: 34,
    marginTop: 14,
    textAlign: 'center',
  },
  x: {
    position: 'absolute',
    right: 0,
    top: 10,
  },
})
