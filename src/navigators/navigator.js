import {createSwitchNavigator} from 'react-navigation';
import AppStack from './appNavigator'
import AuthStack from './authStack'
import AuthLoadingScreen from '../Auth/AuthLoadingScreen'

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
)
