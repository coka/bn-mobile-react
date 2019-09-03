import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Feather} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';
import SharedStyles from '../styles/shared/sharedStyles'
import FormStyles from '../styles/shared/formStyles'
import LoginStyles from '../styles/login/loginStyles'
import EventScannerStyles from '../styles/account/eventScannerStyles'
import {autotrim, username} from '../string'
import {accessCameraRoll, selectCameraRollImage} from '../image'
import {uploadImageToCloudinary} from '../cloudinary'
import BusyButton from '../BusyButton'

const styles = SharedStyles.createStyles()
const formStyles = FormStyles.createStyles()
const loginStyles = LoginStyles.createStyles()
const eventScannerStyles = EventScannerStyles.createStyles()

/* eslint-disable camelcase,space-before-function-paren */

const returnToButton = (navigation) => (
  <TouchableHighlight
    onPress={() => navigation.goBack()}
    underlayColor="rgba(0, 0, 0, 0)"
  >
    <Icon style={loginStyles.backButton} name="arrow-back" />
  </TouchableHighlight>
)

export default class SignUpNext extends Component {
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
      profile_pic_url: null,
      first_name: null,
      last_name: null,
      isBusy: false,
    }
  }

  get currentUser() {
    return this.props.screenProps.auth.state.currentUser.user
  }

  get username() {
    return username({...this.currentUser, ...this.state})
  }

  get profilePicUrl() {
    return this.state.profile_pic_url || this.currentUser.profile_pic_url
  }

  async _buildProfileChanges() {
    const {profile_pic_url, first_name, last_name} = this.state
    const changes = {
      first_name: first_name || this.currentUser.first_name,
      last_name: last_name || this.currentUser.last_name,
    }

    if (profile_pic_url) {
      try {
        const url = await uploadImageToCloudinary(profile_pic_url)

        if (url) {
          changes.profile_pic_url = url
        }
      } catch (error) {
        // TODO: maybe tell them instead of silently dropping it?
      }
    }

    return changes
  }

  updateProfile = async () => {
    const {
      screenProps: {auth},
      navigation: {navigate},
    } = this.props

    if (!auth.isFetching()) {
      this.setState({isBusy: true})

      const profileChanges = await this._buildProfileChanges()
      const results = await auth.updateCurrentUser(profileChanges, () =>
        this.setState({isBusy: false})
      )

      // Don't double-fire the setState
      if (results) {
        this.setState({isBusy: false})
      }

      if (Platform.OS === 'ios') {
        navigate('SignUpNotifications')
      } else {
        navigate('AuthLoading')
      }
    }
  }

  onPressPictureButton = async () => {
    if (await accessCameraRoll()) {
      this.setState({profile_pic_url: await selectCameraRollImage()})
    }
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
                styles.paddingBottomJumbo,
              ]}
            >
              Make your tickets... yours.
            </Text>
            <TextInput
              defaultValue={this.currentUser.first_name}
              style={formStyles.input}
              placeholder="First Name"
              underlineColorAndroid="transparent"
              onChangeText={autotrim((first_name) =>
                this.setState({first_name})
              )}
            />
            <TextInput
              defaultValue={this.currentUser.last_name}
              style={formStyles.input}
              placeholder="Last Name"
              underlineColorAndroid="transparent"
              onChangeText={autotrim((last_name) => this.setState({last_name}))}
            />
            <View style={loginStyles.buttonContainer}>
              <TouchableHighlight
                underlayColor="rgba(0, 0, 0, 0)"
                style={loginStyles.buttonTertiary}
                onPress={this.onPressPictureButton}
              >
                <View style={styles.buttonIconContainer}>
                  <Feather
                    style={loginStyles.buttonTertiaryIcon}
                    name="camera"
                  />
                  <Text style={loginStyles.buttonTertiaryText}>
                    Add Profile Picture
                  </Text>
                </View>
              </TouchableHighlight>
            </View>

            <BusyButton
              style={loginStyles.buttonContainer}
              onPress={this.updateProfile}
              isBusy={this.state.isBusy}
              busyContent={
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#5491CC', '#9A68B2', '#E53D96']}
                  style={loginStyles.button}
                >
                  <ActivityIndicator color="#FFF" />
                </LinearGradient>
              }
            >
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#5491CC', '#9A68B2', '#E53D96']}
                style={loginStyles.button}
              >
                <Text style={loginStyles.buttonText}>
                  {"That's me. Let's find some shows."}
                </Text>
              </LinearGradient>
            </BusyButton>

            {this.profilePicUrl && (
              <View style={loginStyles.profileImageWrapper}>
                <View style={eventScannerStyles.pillContainer}>
                  <View style={styles.flexRowFlexStartCenter}>
                    <Image
                      source={{uri: this.profilePicUrl}}
                      style={loginStyles.profileImage}
                    />
                    <View>
                      <Text
                        style={[
                          eventScannerStyles.pillTextWhite,
                          styles.marginRightTiny,
                        ]}
                      >
                        {this.username}
                      </Text>
                      {false && ( // TODO: enable when API data available
                        <Text style={eventScannerStyles.pillTextSubheader}>
                          VIP Access
                        </Text>
                      )}
                    </View>
                    <Feather
                      style={eventScannerStyles.checkIcon}
                      name="check-circle"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
