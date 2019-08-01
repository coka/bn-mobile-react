import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  Modal,
  Text,
  View,
  Image,
  TouchableHighlight,
  Button,
  Linking,
} from 'react-native'
import {Constants} from 'expo'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import AccountStyles from '../styles/account/accountStyles'
import ModalStyles from '../styles/shared/modalStyles'
import coverPhotoPlaceholder from '../../assets/account-placeholder-bkgd.png'
import qrCodeIcon from '../../assets/qr-code-small.png'
import ReactQRCode from 'react-native-qrcode'
import {username} from '../string'
import {optimizeCloudinaryImage} from '../cloudinary'

const styles = SharedStyles.createStyles()
const accountStyles = AccountStyles.createStyles()
const modalStyles = ModalStyles.createStyles()

const FAN_SUPPORT_LINK = 'https://support.bigneon.com/hc/en-us/categories/360001444351-Fan-Support'

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
        <ReactQRCode
          size={200}
          fgColor="white"
          bgColor="black"
          value={_qrCode}
        />
        <Text style={modalStyles.headerSecondary}>
          This code can be scanned to receive ticket transfers, upgrades, and
          more!
        </Text>
        <View style={[styles.buttonContainer, {borderRadius: 6}]}>
          <TouchableHighlight
            style={[styles.button, {borderRadius: 6}]}
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

    this.props.screenProps.auth.identify()

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
        screenProps: {
          auth: {canScanTickets},
        },
      },
      state: {user, showQRModal},
    } = this

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.containerDark}
      >
        <QRCode
          _qrCode={JSON.stringify({email: user.email, id: user.id})}
          toggleModal={this.toggleQRModal}
          modalVisible={showQRModal}
        />
        <View style={accountStyles.accountBkgdContainer}>
          <Image
            style={accountStyles.accountBkgd}
            source={
              optimizeCloudinaryImage(user.cover_photo_url) ||
              coverPhotoPlaceholder
            }
          />
        </View>

        <View style={styles.headerContainer}>
          <View style={accountStyles.accountHeaderWrapper}>
            <View>
              <Text style={accountStyles.accountEmailHeader}>
                {username(user)}
              </Text>
              <View style={accountStyles.emailWrapper}>
                <Icon style={accountStyles.emailIcon} name="mail" />
                <Text style={accountStyles.accountEmail}>{user.email}</Text>
              </View>
            </View>
            <TouchableHighlight onPress={() => this.toggleQRModal(true)}>
              <Image style={accountStyles.qrCodeSmall} source={qrCodeIcon} />
            </TouchableHighlight>
          </View>
        </View>

        <View style={styles.paddingVerticalMedium}>
          <Text style={accountStyles.sectionHeader}>Account Details</Text>

          <TouchableHighlight
            underlayColor="rgba(0, 0, 0, 0)"
            onPress={() => navigate('AccountDetails')}
          >
            <View style={accountStyles.rowContainer}>
              <View style={accountStyles.row}>
                <Icon style={accountStyles.accountIcon} name="account-circle" />
                <Text style={accountStyles.accountHeader}>Account</Text>
              </View>
              <Icon
                style={accountStyles.accountArrow}
                name="keyboard-arrow-right"
              />
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            underlayColor="rgba(0, 0, 0, 0)"
            onPress={() => navigate('OrderHistory')}
          >
            <View style={accountStyles.rowContainer}>
              <View style={accountStyles.row}>
                <Icon style={accountStyles.accountIcon} name="assignment" />
                <Text style={accountStyles.accountHeader}>Order History</Text>
              </View>
              <Icon
                style={accountStyles.accountArrow}
                name="keyboard-arrow-right"
              />
            </View>
          </TouchableHighlight>

          {(canScanTickets() && (
            <Fragment>
              <Text style={[accountStyles.sectionHeader, styles.marginTop]}>
                Event Tools
              </Text>

              <TouchableHighlight
                underlayColor="rgba(0, 0, 0, 0)"
                onPress={() => navigate('ManageEvents')}
              >
                <View style={accountStyles.rowContainer}>
                  <View style={accountStyles.row}>
                    <Icon
                      style={accountStyles.accountIcon}
                      name="filter-center-focus"
                    />
                    <Text style={accountStyles.accountHeader}>Doorperson</Text>
                  </View>
                  <Icon
                    style={accountStyles.accountArrow}
                    name="keyboard-arrow-right"
                  />
                </View>
              </TouchableHighlight>
            </Fragment>
          )) ||
            null}
          <Button
            onPress={() => Linking.openURL(FAN_SUPPORT_LINK)}
            title="Contact Support"
          />
          <Text
            style={[
              accountStyles.sectionHeader,
              styles.marginTop,
              styles.textCenter,
            ]}
          >
            {`Version ${Constants.manifest.version}`}
          </Text>
        </View>
      </ScrollView>
    )
  }
}
