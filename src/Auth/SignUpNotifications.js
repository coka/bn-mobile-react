import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Image,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { LinearGradient } from 'expo-linear-gradient'
import SharedStyles from '../styles/shared/sharedStyles'
import LoginStyles from '../styles/login/loginStyles'
import BusyButton from '../BusyButton'
import { registerPushTokenIfPermitted } from '../notifications'

const styles = SharedStyles.createStyles()
const loginStyles = LoginStyles.createStyles()

/* eslint-disable camelcase,space-before-function-paren */

function ReturnToButton({ navigation }) {
  return (
    <TouchableHighlight
      onPress={() => navigation.goBack()}
      underlayColor="rgba(0, 0, 0, 0)"
    >
      <Icon style={loginStyles.backButton} name="arrow-back" />
    </TouchableHighlight>
  )
}

export default class SignUpNotifications extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <ReturnToButton navigation={navigation} />,
      headerStyle: loginStyles.navigationContainer,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      isBusy: false,
    }
  }

  setupNotifications = async () => {
    const {
      navigation: { navigate },
    } = this.props

    this.setState({ isBusy: true })
    await registerPushTokenIfPermitted()

    navigate('AuthLoading')
  }

  skipNotificationsSetup = async () => {
    const {
      navigation: { navigate },
    } = this.props

    this.setState({ isBusy: true })
    navigate('AuthLoading')
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={loginStyles.container}
        behavior="padding"
        enabled
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
        >
          <View>
            <Text
              style={[
                styles.headerSecondary,
                styles.textCenter,
                styles.paddingBottomLarge,
              ]}
            >
              {"Don't Miss Out!"}
            </Text>
            <Image source={require('../../assets/ios-notification.png')} />
            <Text
              style={[
                styles.bodyText,
                styles.textCenter,
                styles.paddingVertical,
              ]}
            >
              Turn on notifications to find out when a friend sends you tickets,
              or your upcoming events change.
            </Text>
            <BusyButton
              style={loginStyles.buttonContainer}
              onPress={this.setupNotifications}
              isBusy={this.state.isBusy}
              busyContent={
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={['#5491CC', '#9A68B2', '#E53D96']}
                  style={loginStyles.button}
                >
                  <ActivityIndicator color="#FFF" />
                </LinearGradient>
              }
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#5491CC', '#9A68B2', '#E53D96']}
                style={[loginStyles.button, styles.marginVertical]}
              >
                <Text style={loginStyles.buttonText}>
                  {'Turn notifications ON'}
                </Text>
              </LinearGradient>
            </BusyButton>

            <TouchableHighlight
              onPress={this.skipNotificationsSetup}
              underlayColor="rgba(0, 0, 0, 0)"
            >
              <View style={styles.flexRowCenter}>
                <Text style={loginStyles.mutedText}>
                  {"Nah, hopefully I'll figure it out"}
                </Text>
                <Icon
                  style={loginStyles.mutedText}
                  name="keyboard-arrow-right"
                />
              </View>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
