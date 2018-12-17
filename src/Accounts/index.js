import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import {ScrollView, Modal, Text, View, Image, TouchableHighlight} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import AccountStyles from '../styles/account/accountStyles'
import ModalStyles from '../styles/shared/modalStyles'
import coverPhotoPlaceholder from '../../assets/account-placeholder-bkgd.png'
import qrCodePlaceholder from '../../assets/qr-code-placeholder.png'
import qrCodeIcon from '../../assets/qr-code-small.png'

const styles = SharedStyles.createStyles()
const accountStyles = AccountStyles.createStyles()
const modalStyles = ModalStyles.createStyles()


const QRCode = ({_qrCode, toggleModal, modalVisible}) => (
  <Modal
    onRequestClose={() => {
      toggleModal(!modalVisible)
    }}
    visible={modalVisible}
    transparent
  >
    <View style={modalStyles.modalContainer}>
      <View style={modalStyles.contentWrapper}>
        <Image
          style={modalStyles.qrCode}
          source={qrCodePlaceholder}
        />
        <Text style={modalStyles.header}>Show this to complete a ticket transfer.</Text>
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            style={styles.button}
            name="close"
            onPress={() => {
              toggleModal(!modalVisible)
            }}
          >
            <Text style={styles.buttonText}>Got It</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  </Modal>
)

QRCode.propTypes = {
  _qrCode: PropTypes.string,
  toggleModal: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
}


export default class Account extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    screenProps: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      showQRModal: false,
      user: this.user,
    }
  }

  get user() {
    return this.props.screenProps.auth.state.currentUser.user
  }

  toggleQRModal = (visible) => {
    this.setState({showQRModal: visible})
  }

  render() {
    const {
      props: {
        navigation: {navigate},
        screenProps: {auth: {canScanTickets}},
      },
      state: {user, showQRModal},
    } = this

    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.containerDark}>
        <QRCode _qrCode="" toggleModal={this.toggleQRModal} modalVisible={showQRModal} />
        <View style={accountStyles.accountBkgdContainer}>
          <Image
            style={accountStyles.accountBkgd}
            source={user.cover_photo_url || coverPhotoPlaceholder}
          />
          {false &&  // TODO: Re-enable when functionality is implemented.
          <View style={accountStyles.accountPhotoContainer}>
            <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)">
              <Text style={accountStyles.accountPhotoText}>+ TAP TO ADD A COVER PHOTO</Text>
            </TouchableHighlight>
          </View>
          }
        </View>

        <View style={styles.headerContainer}>
          {false && // TODO: Re-enable when functionality is implemented.
          <View style={accountStyles.avatarPlaceholderContainer}>
            <Icon style={accountStyles.avatarIcon} name="person-add" />
          </View>
          }

          <View style={accountStyles.accountHeaderWrapper}>
            <View>
              <Text style={accountStyles.accountEmailHeader}>{user.first_name} {user.last_name}</Text>
              <View style={accountStyles.emailWrapper}>
                <Icon style={accountStyles.emailIcon} name="mail" />
                <Text style={accountStyles.accountEmail}>{user.email}</Text>
              </View>
            </View>
            <TouchableHighlight onPress={() => this.toggleQRModal(true)}>
              <Image
                style={accountStyles.qrCodeSmall}
                source={qrCodeIcon}
              />
            </TouchableHighlight>
          </View>
        </View>

        <View style={styles.paddingVerticalMedium}>

          <Text style={accountStyles.sectionHeader}>Account Details</Text>

          <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={() => navigate('AccountDetails')}>
            <View style={accountStyles.rowContainer}>
              <View style={accountStyles.row}>
                <Icon style={accountStyles.accountIcon} name="account-circle" />
                <Text style={accountStyles.accountHeader}>Account</Text>
              </View>
              <Icon style={accountStyles.accountArrow} name="keyboard-arrow-right" />
            </View>
          </TouchableHighlight>


          {false && // TODO: Re-enable when functionality is implemented.
          <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={() => navigate('Notifications')}>
            <View style={accountStyles.rowContainer}>
              <View style={accountStyles.row}>
                <Icon style={accountStyles.accountIcon} name="notifications" />
                <Text style={accountStyles.accountHeader}>Notification Preferences</Text>
              </View>
              <Icon style={accountStyles.accountArrow} name="keyboard-arrow-right" />
            </View>
          </TouchableHighlight>
          }

          {false &&  // TODO: Re-enable when functionality is implemented.
          <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={() => navigate('Billing')}>
            <View style={accountStyles.rowContainer}>
              <View style={accountStyles.row}>
                <Icon style={accountStyles.accountIcon} name="credit-card" />
                <Text style={accountStyles.accountHeader}>Billing Information</Text>
              </View>
              <Icon style={accountStyles.accountArrow} name="keyboard-arrow-right" />
            </View>
          </TouchableHighlight>
          }

          {false && // TODO: Re-enable when functionality is implemented.
          <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={() => navigate('OrderHistory')}>
            <View style={accountStyles.rowContainer}>
              <View style={accountStyles.row}>
                <Icon style={accountStyles.accountIcon} name="assignment" />
                <Text style={accountStyles.accountHeader}>Order History</Text>
              </View>
              <Icon style={accountStyles.accountArrow} name="keyboard-arrow-right" />
            </View>
          </TouchableHighlight>
          }

          {canScanTickets() &&
          <Fragment>
            <Text style={[accountStyles.sectionHeader, styles.marginTop]}>Event Tools</Text>

            <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={() => navigate('ManageEvents')}>
              <View style={accountStyles.rowContainer}>
                <View style={accountStyles.row}>
                  <Icon style={accountStyles.accountIcon} name="filter-center-focus" />
                  <Text style={accountStyles.accountHeader}>Doorman</Text>
                </View>
                <Icon style={accountStyles.accountArrow} name="keyboard-arrow-right" />
              </View>
            </TouchableHighlight>
          </Fragment>
          || null}
        </View>
      </ScrollView>
    )
  }
}
