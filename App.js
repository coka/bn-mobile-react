import React, {Component, createElement} from 'react'
import {Provider} from 'unstated'
import {loadFonts} from './assets/fonts'
import {loadImages} from './assets'
import {View} from 'react-native';
import {Video, Asset, AppLoading, SplashScreen} from 'expo';
import navigator from './src/navigators/navigator'
import SharedStyles from './src/styles/shared/sharedStyles'
import {EventsContainer} from './src/state/eventStateProvider'
import {TicketsContainer} from './src/state/ticketStateProvider'
import {CartContainer} from './src/state/cartStateProvider'
import {AuthContainer} from './src/state/authStateProvider'
import {analyticsInit} from './src/constants/analytics';

const CONTAINERS = {}

function addContainer(key, klass, ...args) {
  CONTAINERS[key] = new klass(...args)
  CONTAINERS[key].containers = CONTAINERS
}

addContainer('events', EventsContainer)
addContainer('tickets', TicketsContainer)
addContainer('cart', CartContainer)
addContainer('auth', AuthContainer)

const CONTAINERS_TO_INJECT = Object.keys(CONTAINERS).map((key) => CONTAINERS[key])

const styles = SharedStyles.createStyles()
const cacheSplashResourcesAsync = async () => { // eslint-disable-line space-before-function-paren
  const video = require('./splash.mp4')

  return Asset.fromModule(video).downloadAsync()
}

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

  _cacheResourcesAsync = async () => { // eslint-disable-line space-before-function-paren
    SplashScreen.hide();

    setTimeout(() => {
      this.setState({isSplashDone: true});
    }, 3000);
    await loadFonts()
    await loadImages()
    this.setState({isAppReady: true});
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
          startAsync={cacheSplashResourcesAsync}
          onFinish={() => this.setState({isSplashReady: true})}
          onError={console.warn} // eslint-disable-line no-console
          autoHideSplash={false}
        />
      )
    }

    if (!this.state.isAppReady || !this.state.isSplashDone) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Video
            style={styles.splashVideo}
            source={require('./splash.mp4')}
            onLoad={this._cacheResourcesAsync}
            resizeMode="cover"
            shouldPlay
          />
        </View>
      );
    }

    return (
      <Provider inject={CONTAINERS_TO_INJECT}>
        {createElement(navigator)}
      </Provider>
    )
  }
}
