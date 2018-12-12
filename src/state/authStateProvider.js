import {Container} from 'unstated'
import {AsyncStorage} from 'react-native'
import {server, bigneonServer, apiErrorAlert, needsRefresh} from '../constants/Server'

/* eslint-disable camelcase,space-before-function-paren */
class AuthContainer extends Container {
  constructor(props = {}) {
    super(props);

    this.state = this.defaultState
  }

  get defaultState() {
    return {
      currentUser: {},
      access_token: null,
      refresh_token: null,
    }
  }

  // @TODO: Implement a login that also sets AsyncStgorage user
  logIn = async (formData, navigate) => { // eslint-disable-line space-before-function-paren
    try {
      const resp = await server.auth.authenticate(formData)

      this.setLoginData(resp, navigate)
    } catch (error) {
      apiErrorAlert(error, 'There was a problem logging in.')

      navigate('LogIn')
    }
  }

  // Can set tokens after login or signup
  async setLoginData(resp, navigate, refresh = false) {
    const {data: {access_token, refresh_token}} = resp

    await AsyncStorage.multiSet([['userToken', access_token], ['refreshToken', refresh_token]])
    await this.getCurrentUser(navigate, access_token, refresh_token, refresh)
    navigate('AuthLoading')
  }

  logOut = async (navigate) => { // eslint-disable-line space-before-function-paren
    // await AsyncStorage.clear(); // This was maybe throwing errors when calling it on an empty asyncstorage.
    await AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove)

    this.setState(this.defaultState, () => {
      navigate('AuthLoading')
    })
  }

  getCurrentUser = async (navigate, access_token, refresh_token, setToken = true) => { // eslint-disable-line space-before-function-paren
    if (setToken) {
      try {
        if (needsRefresh(access_token)) {
          const refreshTokenResp = await server.auth.refresh({refresh_token})
          const {data} = refreshTokenResp

          access_token = data.access_token
          refresh_token = data.refresh_token
        }

        await AsyncStorage.multiSet([['userToken', access_token], ['refreshToken', refresh_token]])

        // needs to use direct bigneonServer because proxy server cant set token on itself
        await bigneonServer.client.setToken(access_token)
      } catch (error) {
        apiErrorAlert(error, 'There was a problem logging you in.')

        this.logOut(navigate)
      }
    }

    try {
      const myUserResponse = await server.users.current()

      this.setState({currentUser: myUserResponse.data, access_token, refresh_token})
    } catch (error) {
      apiErrorAlert(error, 'There was a problem logging you in.')

      this.logOut(navigate)
    }
  }

  updateCurrentUser = async (params) => {
    try {

      const {data} = await server.users.update(params)

      await this.setState({currentUser: data})
      return data
    } catch (error) {
      return error.response.data
    }
  }

  signUp = async (formData, navigate) => {
    try {
      const response = await server.users.createAndLogin({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone: '',
      })

      this.setLoginData(response, navigate, true)
    } catch (error) {
      apiErrorAlert(error, 'There was an error creating your account.')
    }
  }

  hasScope = (key) => {
    const {currentUser} = this.state

    if (!currentUser) {
      return false
    }

    const scopes = currentUser.organization_scopes || {}
    const orgIds = Object.keys(scopes)

    for (let i = 0; i < orgIds.length; i++) {
      if (scopes[orgIds[i]].includes(key)) {
        return true
      }
    }

    return false
  }

  canScanTickets = () => this.hasScope('event:scan')
}

export {
  AuthContainer,
}
