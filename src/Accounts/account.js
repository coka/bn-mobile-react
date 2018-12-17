import React, {Component} from 'react'
import {Text, View, Image, TextInput, ScrollView, TouchableHighlight} from 'react-native'
import SharedStyles from '../styles/shared/sharedStyles'
import AccountStyles from '../styles/account/accountStyles'
import TicketWalletStyles from '../styles/tickets/ticketWalletStyles'
import avatarPlaceholder from '../../assets/avatar-female.png'
import {autotrim} from '../string'

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

  updateUser = (attr) => (value) => {
    const user = {...this.state.user}

    user[attr] = value
    this.setState({user})
  }

  saveChanges = async () => {
    const result = await this.props.screenProps.auth.updateCurrentUser(this.state.user)

    if (result.error) {
      this.onSaveChangesError(result)
    } else {
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

  render() {
    const {
      props: {
        navigation: {navigate},
        screenProps: {auth: {logOut}},
      },
      state: {
        user,
      }
    } = this

    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.containerDark}>
        <View style={styles.paddingVerticalMedium}>

          {false &&  // TODO: Re-enable when functionality is implemented.
          <View style={accountStyles.rowContainer}>
            <View style={accountStyles.row}>
              <View style={[ticketWalletStyles.avatarContainer, accountStyles.avatarContainer]}>
                <Image
                  style={ticketWalletStyles.avatar}
                  source={avatarPlaceholder}
                />
              </View>
              <TouchableHighlight style={styles.flexColumnCenter}>
                <Text style={styles.buttonSecondaryText} onPress={() => navigate('ChangePhoto')}>Change Profile Photo</Text>
              </TouchableHighlight>
            </View>
          </View>
          }

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
