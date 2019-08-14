import {Container} from 'unstated'
import {AsyncStorage} from 'react-native'

import {server, refreshWithToken, apiErrorAlert} from '../constants/Server'
import {registerPushTokenIfPermitted} from '../notifications'
import {identify, track} from '../constants/analytics'
import {requestFacebookAuth, connectFacebookToBigNeon} from '../facebook'

/* eslint-disable camelcase,space-before-function-paren */

function shouldDoAdditionalSignUpStep(currentUser) {
  const {first_name: first, last_name: last} = currentUser

  return !(first && last)
}

class AuthContainer extends Container {
  constructor(props = {}) {
    super(props)

    this.state = this.defaultState
  }

  get defaultState() {
    return {
      currentUser: {},
      access_token: null,
      refresh_token: null,
      isFetching: false,
    }
  }

  // Can set tokens after login or signup
  async setLoginData(resp, navigate, refresh = false) {
    const {
      data: {access_token, refresh_token},
    } = resp

    await AsyncStorage.multiSet([
      ['userToken', access_token],
      ['refreshToken', refresh_token],
    ])

    const currentUser = await this.getCurrentUser(
      navigate,
      access_token,
      refresh_token,
      refresh
    )

    if (shouldDoAdditionalSignUpStep(currentUser)) {
      navigate('SignUpNext')
    } else {
      navigate('AuthLoading')
    }
  }

  logOut = async (navigate) => {
    // eslint-disable-line space-before-function-paren
    // await AsyncStorage.clear(); // This was maybe throwing errors when calling it on an empty asyncstorage.
    await this.setState({isFetching: true})
    await AsyncStorage.getAllKeys(async (err, keys) => {
      await AsyncStorage.multiRemove(keys);
    });

    this.setState(this.defaultState, () => {
      navigate('AuthLoading')
    })
  }

  getCurrentUser = async (
    navigate,
    access_token,
    refresh_token,
    setToken = true
  ) => {

    // eslint-disable-line space-before-function-paren
    try {
      await this.setState({isFetching: true})

      if (setToken) {
        await refreshWithToken(refresh_token)
      }
      const {data: currentUser} = await server.users.current()

      await this.setState({currentUser, access_token, refresh_token})
      registerPushTokenIfPermitted()
      return currentUser.user
    } catch (error) {
      apiErrorAlert(error, 'There was a problem logging you in.')

      this.logOut(navigate)
    } finally {
      await this.setState({isFetching: false})
    }
  }

  updateCurrentUser = async (params, onError = () => {}) => {
    try {
      await this.setState({isFetching: true})

      const {data} = await server.users.update(params)

      await this.setState({currentUser: data})
      return data
    } catch (error) {
      onError()
      setTimeout(() => {
        apiErrorAlert(error, 'There was an error updating your profile.')
      }, 600)
      return false
    } finally {
      await this.setState({isFetching: false})
    }
  }

  identify = async (action = '') => {
    const {
      currentUser: {
        user: {id, first_name, last_name, email},
      },
    } = this.state

    await identify({id, firstName: first_name, lastName: last_name, email})

    if (action !== '') {
      track(action)
    }
  }

  signUp = async (formData, navigate) => {
    try {
      await this.setState({isFetching: true})
      const response = await server.users.createAndLogin({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone: '',
      })

      await this.setLoginData(response, navigate, true)
      this.identify('Signed Up')
      return true
    } catch (error) {
      apiErrorAlert(error, 'There was an error creating your account.')
      return false
    } finally {
      await this.setState({isFetching: false})
    }
  }

  logIn = async (formData, navigate) => {
    // eslint-disable-line space-before-function-paren
    try {
      await this.setState({isFetching: true})
      const resp = await server.auth.authenticate(formData)

      await this.setLoginData(resp, navigate)
      this.identify('Signed In')
      return true
    } catch (error) {
      apiErrorAlert(error, 'There was a problem logging in.')

      navigate('LogIn')
      return false
    } finally {
      await this.setState({isFetching: false})
    }
  }

  facebook = async (navigate, loading = () => {}) => {
    await this.setState({isFetching: true})
    try {
      const facebook = await requestFacebookAuth()

      if (!facebook) {
        return
      } else {
        loading(true)
      }

      const resp = await connectFacebookToBigNeon(facebook)

      await this.setLoginData(resp, navigate, true)
      this.identify('Signed In')
      return true
    } catch (error) {
      setTimeout(() => {
        apiErrorAlert(error)
      }, 600)
      navigate('LogIn')
      return false
    } finally {
      loading(false)
      await this.setState({isFetching: false})
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

  isFetching = () => this.state.isFetching
}

export {AuthContainer}
