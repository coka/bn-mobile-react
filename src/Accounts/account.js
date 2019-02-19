import React, {Component} from 'react'
import {Text, View, Image, TextInput, ScrollView, TouchableHighlight} from 'react-native'
import SharedStyles from '../styles/shared/sharedStyles'
import AccountStyles from '../styles/account/accountStyles'
import TicketWalletStyles from '../styles/tickets/ticketWalletStyles'
import {autotrim} from '../string'
import {accessCameraRoll, selectCameraRollImage} from '../image'
import {uploadImageToCloudinary} from '../cloudinary'

const styles = SharedStyles.createStyles()
const accountStyles = AccountStyles.createStyles()
const ticketWalletStyles = TicketWalletStyles.createStyles()

export default class AccountDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {...props.screenProps.auth.state.currentUser.user}
    }
  }

  _updateUser(attr, value) {
    const user = {...this.state.user}

    user[attr] = value
    this.setState({user})
  }

  updateUser = (attr) => (value) => this._updateUser(attr, value)

  async prepareUserChanges() {
    const {user, newProfilePic} = this.state
    const changes = {...user}

    if (newProfilePic) {
      changes.profile_pic_url = await uploadImageToCloudinary(newProfilePic)
    }

    return changes
  }

  saveChanges = async () => {
    const changes = await this.prepareUserChanges()
    const result = await this.props.screenProps.auth.updateCurrentUser(changes)

    if (result.error) {
      this.onSaveChangesError(result)
    } else {
      this.props.screenProps.auth.identify()
      this.onSaveChangesSuccess(result)
    }
  }

  onSaveChangesSuccess() {
    alert('Your information has been updated.')
  }

  onSaveChangesError({error, fields}) {
    const msg = Object
      .keys(fields)
      .map((key) => fields[key].map(({message}) => message).join('\n'))
      .join('\n')

    alert(`There was a problem:\n\n${msg}`)
  }

  onPressPictureButton = async () => {
    if (await accessCameraRoll()) {
      this.setState({newProfilePic: await selectCameraRollImage()})
    }
  }

  get profilePicSourceToDisplay() {
    const uri = this.state.newProfilePic || this.state.user.profile_pic_url

    return uri ? {uri} : null
  }

  render() {
    const {
      props: {
        navigation: {navigate},
        screenProps: {auth: {logOut}},
      },
      state: {
        user,
      },
    } = this

    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.containerDark}>
        <View style={styles.paddingVerticalMedium}>
          <View style={accountStyles.rowContainer}>
            <View style={accountStyles.row}>
              <View style={[ticketWalletStyles.avatarContainer, accountStyles.avatarContainer]}>
                <Image
                  style={ticketWalletStyles.avatar}
                  source={this.profilePicSourceToDisplay}
                />
              </View>
              <TouchableHighlight style={styles.flexColumnCenter}>
                <Text style={styles.buttonSecondaryText} onPress={this.onPressPictureButton}>Change Profile Photo</Text>
              </TouchableHighlight>
            </View>
          </View>

          <View style={accountStyles.inputContainer}>
            <View style={accountStyles.row}>
              <Text style={accountStyles.accountInputHeaderDisabled}>First Name</Text>
              <TextInput
                style={accountStyles.accountInputHeader}
                defaultValue={user.first_name}
                placeholderTextColor='#CCC'
                underlineColorAndroid="transparent"
                onChangeText={autotrim(this.updateUser('first_name'))}
              />
            </View>
          </View>

          <View style={accountStyles.inputContainer}>
            <View style={accountStyles.row}>
              <Text style={accountStyles.accountInputHeaderDisabled}>Last Name</Text>
              <TextInput
                style={accountStyles.accountInputHeader}
                defaultValue={user.last_name}
                placeholderTextColor='#CCC'
                underlineColorAndroid="transparent"
                onChangeText={autotrim(this.updateUser('last_name'))}
              />
            </View>
          </View>

          <View style={[accountStyles.inputContainer, styles.marginTop]}>
            <View style={accountStyles.row}>
              <Text style={accountStyles.accountInputHeaderDisabled}>Mobile</Text>
              <TextInput
                style={accountStyles.accountInputHeader}
                defaultValue={user.phone}
                placeholderTextColor='#CCC'
                underlineColorAndroid="transparent"
                onChangeText={autotrim(this.updateUser('phone'))}
              />
            </View>
          </View>

          <View style={accountStyles.inputContainer}>
            <View style={accountStyles.row}>
              <Text style={accountStyles.accountInputHeaderDisabled}>Email</Text>
              <TextInput
                keyboardType="email-address"
                style={accountStyles.accountInputHeader}
                defaultValue={user.email}
                placeholderTextColor='#CCC'
                underlineColorAndroid="transparent"
                onChangeText={autotrim(this.updateUser('email'))}
              />
            </View>
          </View>

          <View style={accountStyles.inputContainer}>
            <View style={accountStyles.row}>
              <Text style={accountStyles.accountInputHeaderDisabled}>Password</Text>
              <TextInput
                style={accountStyles.accountInputHeader}
                placeholder="(hidden)"
                placeholderTextColor='#CCC'
                underlineColorAndroid="transparent"
                onChangeText={this.updateUser('password')}
                secureTextEntry
              />
            </View>
          </View>

          <View style={[styles.buttonContainer]}>
            <TouchableHighlight
              style={styles.buttonSecondary}
              onPress={this.saveChanges}
              underlayColor="rgba(0, 0, 0, 0)"
            >
              <Text style={styles.buttonSecondaryText}>Save Changes</Text>
            </TouchableHighlight>
          </View>

          <View style={[styles.buttonContainer, styles.marginTop]}>
            <TouchableHighlight
              style={styles.buttonSecondary}
              onPress={() => logOut(navigate)}
              underlayColor="rgba(0, 0, 0, 0)"
            >
              <Text style={styles.buttonSecondaryText}>Sign Out</Text>
            </TouchableHighlight>
          </View>

        </View>
      </ScrollView>
    )
  }
}
