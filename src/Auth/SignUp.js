import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableHighlight} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {LinearGradient} from 'expo'
import SharedStyles from '../styles/shared/sharedStyles'
import FormStyles from '../styles/shared/formStyles'
import LoginStyles from '../styles/login/loginStyles'
import { Constants, WebBrowser } from 'expo';
import { autotrim } from '../string';

const styles = SharedStyles.createStyles()
const formStyles = FormStyles.createStyles()
const loginStyles = LoginStyles.createStyles()

/* eslint-disable camelcase,space-before-function-paren */

const returnToButton = (navigation) => (
  <TouchableHighlight onPress={() => navigation.goBack()} underlayColor="rgba(0, 0, 0, 0)">
    <Icon style={loginStyles.backButton} name="arrow-back" />
  </TouchableHighlight>
)

export default class SignUp extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: returnToButton(navigation),
      headerStyle: loginStyles.navigationContainer,
    }
  };

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
    }
  }

  signUp = async () => {
    const {screenProps: {auth}, navigation: {navigate}} = this.props
    const {email, password, first_name, last_name} = this.state

    // Should register & login on success
    await auth.signUp({email, password, first_name, last_name}, navigate)
  }

  render() {
    return (
      <KeyboardAvoidingView style={loginStyles.container} behavior="padding" enabled>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text style={[styles.headerSecondary, styles.textCenter, styles.paddingBottomJumbo]}>
              Create your account
            </Text>
            <TextInput
              style={formStyles.input}
              placeholder="First Name"
              underlineColorAndroid="transparent"
              onChangeText={autotrim((first_name) => this.setState({first_name}))}
            />
            <TextInput
              style={formStyles.input}
              placeholder="Last Name"
              underlineColorAndroid="transparent"
              onChangeText={autotrim((last_name) => this.setState({last_name}))}
            />
            <TextInput
              keyboardType="email-address"
              style={formStyles.input}
              placeholder="Email Address"
              underlineColorAndroid="transparent"
              onChangeText={autotrim((email) => this.setState({email}))}
            />
            <TextInput
              style={formStyles.input}
              secureTextEntry
              placeholder="Password"
              underlineColorAndroid="transparent"
              onChangeText={(password) => this.setState({password})}
            />
            <TouchableHighlight style={loginStyles.buttonContainer} onPress={this.signUp}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#5491CC', '#9A68B2', '#E53D96']}
                style={loginStyles.button}
              >
                <Text style={loginStyles.buttonText}>{"Let's Do This"}</Text>
              </LinearGradient>
            </TouchableHighlight>
          </View>

          <View>
            <Text style={[loginStyles.mutedText, styles.textCenter]}>By signing up you agree to our</Text>
            <View 
              style={{flexDirection: 'row',justifyContent: 'center'}}
            >
            <TouchableHighlight 
              style={{flexDirection:'column'}}
              onPress={ () => {
                WebBrowser.openBrowserAsync('https://www.bigneon.com/terms.html')
              }}>
              <Text style={[loginStyles.mutedText, styles.textCenter, styles.textUnderline]}>Terms of Service</Text>
            </TouchableHighlight>
            <Text style={{flexDirection:'column'}}> &amp; </Text>
            <TouchableHighlight
              style={{flexDirection:'column'}}
              onPress={ () => {
                WebBrowser.openBrowserAsync('https://www.bigneon.com/privacy.html')
              }}
            >
              <Text style={[loginStyles.mutedText, styles.textCenter, styles.textUnderline]}>Privacy Policy</Text>
            </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
