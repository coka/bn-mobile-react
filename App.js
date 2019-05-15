import React, {Component, createElement} from 'react'
import {Provider} from 'unstated'
import {loadFonts} from './assets/fonts'
import {loadImages} from './assets'
import {View} from 'react-native'
import {AppLoading, SplashScreen} from 'expo'
import navigator from './src/navigators/navigator'
import SharedStyles from './src/styles/shared/sharedStyles'
import {EventsContainer} from './src/state/eventStateProvider'
import {TicketsContainer} from './src/state/ticketStateProvider'
import {CartContainer} from './src/state/cartStateProvider'
import {AuthContainer} from './src/state/authStateProvider'
import {analyticsInit} from './src/constants/analytics'
import Sentry from 'sentry-expo'
import LottieView from 'lottie-react-native'

// Sentry.enableInExpoDevelopment = true // Remove this once Sentry is correctly setup.
Sentry.config(
  'https://c59ea227ebbb4306b332c35af91e292f@sentry.io/1407235'
).install()

const CONTAINERS = {}

function addContainer(key, klass, ...args) {
  CONTAINERS[key] = new klass(...args)
  CONTAINERS[key].containers = CONTAINERS
}

addContainer('events', EventsContainer)
addContainer('tickets', TicketsContainer)
addContainer('cart', CartContainer)
addContainer('auth', AuthContainer)

const CONTAINERS_TO_INJECT = Object.keys(CONTAINERS).map(
  (key) => CONTAINERS[key]
)

const styles = SharedStyles.createStyles()

export default class App extends Component {
  constructor() {
    super()

    analyticsInit()
  }

  state = {
    isAppReady: false,
    isSplashReady: false,
    isSplashDone: false,
  }

  _cacheResourcesAsync = async() => {
    // eslint-disable-line space-before-function-paren
    SplashScreen.hide()

    setTimeout(() => {
      this.setState({isSplashDone: true})
    }, 3000)
    await loadFonts()
    await loadImages()
    this.setState({isAppReady: true})
  }

  // Sign Out Code
  // _signOutAsync = async () => {
  //   await AsyncStorage.clear();
  //   this.props.navigation.navigate('Auth');
  // };

  render() {
    if (!this.state.isSplashReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({isSplashReady: true})}
          onError={console.warn} // eslint-disable-line no-console
          autoHideSplash={false}
        />
      )
    }

    if (!this.state.isAppReady || !this.state.isSplashDone) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <LottieView
            source={require('./assets/heart-animation.json')}
            autoPlay
            loop={false}
          />
        </View>
      )
    }

    return (
      <Provider inject={CONTAINERS_TO_INJECT}>
        {createElement(navigator)}
      </Provider>
    )
  }
}
