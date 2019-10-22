import React from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Button from '../components/Button'
import Input from '../components/Input'
import Link from '../components/Link'
import { colors, fonts } from '../styles/shared/sharedStyles'

class LogIn extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      submitting: false,
      submittingFacebook: false,
    }
  }

  logIn = async () => {
    const {
      screenProps: { auth },
      navigation: { navigate },
    } = this.props
    const { email, password } = this.state

    if (!auth.isFetching()) {
      this.setState({ submitting: true })
      const isLoggedIn = await auth.logIn({ email, password }, navigate)
      if (!isLoggedIn) {
        this.setState({ submitting: false })
      }
    }
  }

  render() {
    const { facebook } = this.props.screenProps.auth
    const { navigate } = this.props.navigation
    const { email, password, submitting } = this.state

    const shouldDisableSubmission = !email || !password

    return (
      <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View>
            <View style={styles.navigationContainer}>
              <TouchableHighlight
                style={styles.backWrapper}
                onPress={() => navigation.goBack()}
                underlayColor="#d3d3d3"
              >
                <Image
                  style={{ width: 22, height: 18 }}
                  source={require('../../assets/back.png')}
                />
              </TouchableHighlight>
              <View style={styles.logoWrapper}>
                <Image
                  style={{ width: 25, height: 26 }}
                  source={require('../../assets/logo.png')}
                />
              </View>
            </View>
            <Text style={styles.subtitle}>Access your experiences</Text>
            <Text style={styles.title}>Log In to Your Account</Text>
            <Input
              keyboardType="email-address"
              onChangeText={(email) => this.setState({ email })}
              placeholder="Email Address"
              value={email}
            />
            <View style={styles.passwordInputContainer}>
              <Input
                onChangeText={(password) => this.setState({ password })}
                placeholder="Password"
                value={password}
              />
              <Text
                style={styles.forgotLink}
                onPress={() =>
                  navigate('PasswordReset', {
                    defaultEmail: email,
                  })
                }
              >
                Forgot?
              </Text>
            </View>
            <Button
              busy={submitting}
              disabled={shouldDisableSubmission}
              label="Log In"
              onPress={this.logIn}
            />
            <View style={styles.orContainer}>
              <View style={styles.orDash} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.orDash} />
            </View>
            <Button
              label="Continue with Facebook"
              onPress={() =>
                facebook(navigate, (loading) =>
                  this.setState({ submittingFacebook: loading })
                )
              }
            />
          </View>
          <View>
            <Text style={styles.footer}>
              New to Big Neon?{' '}
              <Link onPress={() => navigate('SignUp')}>Sign Up</Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  backWrapper: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
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
  forgotLink: {
    color: colors.brand,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    position: 'absolute',
    right: 21,
    top: 16,
  },
  logoWrapper: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  navigationContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  orContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
    marginTop: 25,
  },
  orDash: {
    backgroundColor: '#e7e8ed',
    height: 1,
    width: 25,
  },
  orText: {
    color: '#9da3b4',
    fontFamily: fonts.medium,
    fontSize: 16,
    paddingHorizontal: 11,
  },
  passwordInputContainer: {
    marginVertical: 15,
  },
  subtitle: {
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 15,
    marginVertical: 15,
    textAlign: 'center',
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 30,
    marginBottom: 30,
    textAlign: 'center',
  },
})

export default LogIn
