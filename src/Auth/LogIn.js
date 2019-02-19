import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, Image, TextInput, TouchableHighlight} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {LinearGradient} from 'expo'
import SharedStyles from '../styles/shared/sharedStyles'
import FormStyles from '../styles/shared/formStyles'
import LoginStyles from '../styles/login/loginStyles'
import { autotrim } from '../string'

const styles = SharedStyles.createStyles()
const formStyles = FormStyles.createStyles()
const loginStyles = LoginStyles.createStyles()

const returnToButton = (navigation) => (
  <TouchableHighlight onPress={() => navigation.goBack()} underlayColor="rgba(0, 0, 0, 0)">
    <Icon style={loginStyles.backButton} name="arrow-back" />
  </TouchableHighlight>
)

export default class LogIn extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: returnToButton(navigation),
      headerStyle: loginStyles.navigationContainer,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
    }
  }

  logIn = async () => {
    const {screenProps: {auth}, navigation: {navigate}} = this.props
    const {email, password} = this.state

    await auth.logIn({email, password}, navigate)
  }

  render() {
    return (
      <View style={loginStyles.container}>

        <View>
          <Text style={[styles.headerSecondary, styles.textCenter, styles.paddingBottomJumbo]}>
            Welcome back!
          </Text>
          <TextInput
            keyboardType="email-address"
            autoCapitalize="none"
            style={formStyles.input}
            placeholder="Email Address"
            underlineColorAndroid="transparent"
            onChangeText={autotrim((email) => this.setState({email}))}
          />
          <TextInput
            style={formStyles.input}
            placeholder="Password"
            underlineColorAndroid="transparent"
            secureTextEntry
            onChangeText={(password) => this.setState({password})}
          />
          <TouchableHighlight style={loginStyles.buttonContainer} onPress={this.logIn}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#5491CC', '#9A68B2', '#E53D96']}
              style={loginStyles.button}
            >
              <Text style={loginStyles.buttonText}>Login to your account</Text>
            </LinearGradient>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.props.navigation.navigate('PasswordReset', {defaultEmail: this.state.email})}>
            <View style={styles.flexRowCenter}>
              <Text style={styles.linkTextDark}>Reset your password</Text>
              <Icon name="keyboard-arrow-right" />
            </View>
          </TouchableHighlight>
        </View>

        {false && // TODO: Re-enable when functionality is implemented.
        <View>
          <TouchableHighlight>
            <View style={styles.flexRowCenter}>
              <Image
                style={loginStyles.facebookIcon}
                source={require('../../assets/icon-facebook.png')}
              />
              <Text style={loginStyles.linkTextBlue}>Login with Facebook</Text>
              <Icon style={loginStyles.arrowIconBlue} name="keyboard-arrow-right" />
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={styles.paddingTopSmall}>
            <View style={styles.flexRowCenter}>
              <Icon style={loginStyles.phoneIcon} name="phone-iphone" />
              <Text style={styles.linkTextDark}>Login with SMS</Text>
              <Icon name="keyboard-arrow-right" />
            </View>
          </TouchableHighlight>
        </View>
        }

      </View>
    )
  }
}
