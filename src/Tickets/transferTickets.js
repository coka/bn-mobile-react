import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import {
  Modal,
  ScrollView,
  Text,
  View,
  Image,
  TouchableHighlight,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native'
import CircleCheckBox from 'react-native-circle-checkbox'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles, {
  backgroundColor,
  primaryColor,
} from '../styles/shared/sharedStyles'
import TicketStyles from '../styles/tickets/ticketStyles'
import TicketWalletStyles from '../styles/tickets/ticketWalletStyles'
import TicketTransferStyles from '../styles/tickets/ticketTransferStyles'
import ModalStyles from '../styles/shared/modalStyles'
import FormStyles from '../styles/shared/formStyles'
import {autotrim, pluralize} from '../string'
import qrCodeIcon from '../../assets/qr-code-small.png'
import {BarCodeScanner, Permissions} from 'expo'
import BusyButton from '../BusyButton'

const styles = SharedStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()
const ticketWalletStyles = TicketWalletStyles.createStyles()
const ticketTransferStyles = TicketTransferStyles.createStyles()
const modalStyles = ModalStyles.createStyles()
const formStyles = FormStyles.createStyles()

function Card({children}) {
  return (
    <View style={styles.flexRowCenter}>
      <View style={ticketTransferStyles.cardContainer}>{children}</View>
    </View>
  )
}

const QRCodeScanner = ({toggleModal, modalVisible, handleBarCodeScanned}) => (
  <Modal
    onRequestClose={() => {
      toggleModal(!modalVisible)
    }}
    visible={modalVisible}
    transparent
  >
    <View style={modalStyles.modalContainer}>
      <View style={modalStyles.contentWrapper}>
        <BarCodeScanner
          onBarCodeRead={handleBarCodeScanned}
          style={{height: 250, width: 250}}
        />
        <Text style={modalStyles.headerSecondary}>
          Scan the recipients barcode found in their Big Neon account tab.
        </Text>

        <View style={[styles.buttonContainer, {borderRadius: 6}]}>
          <TouchableHighlight
            style={[styles.button, {borderRadius: 6}]}
            name="Cancel"
            onPress={() => {
              toggleModal(false)
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  </Modal>
)

QRCodeScanner.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  handleBarCodeScanned: PropTypes.func.isRequired,
}
export default class TransferTickets extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isSubmitting: false,
      checkboxes: {[props.navigation.state.params.ticketId]: true},
      emailOrPhone: '',
      showQRModal: false,
      hasCameraPermission: null,
      scannedEmail: null,
    }
  }

  handleBarCodeScanned = async({_type, data}) => {
    parsedScan = JSON.parse(data)
    if (this.state.scannedEmail === parsedScan.email) {
      return
    }
    this.setState({scannedEmail: parsedScan.email})
    this.toggleQRModal(false)
  }

  toggleQRModal = (visible) => {
    this.setState({showQRModal: visible})
    if (visible && !this.state.hasCameraPermission) {
      this.cameraPermissions()
    }
  }
  get tickets() {
    const {
      navigation: {
        state: {
          params: {activeTab, eventId},
        },
      },
      screenProps: {
        store: {ticketsForEvent},
      },
    } = this.props

    return ticketsForEvent(activeTab, eventId).tickets
  }

  get firstName() {
    const {
      navigation: {
        state: {
          params: {firstName},
        },
      },
    } = this.props

    return firstName
  }

  get lastName() {
    const {
      navigation: {
        state: {
          params: {lastName},
        },
      },
    } = this.props

    return lastName
  }

  get label() {
    return `${this.firstName} ${this.lastName}`
  }

  get transferTickets() {
    const {checkboxes} = this.state
    const keys = Object.keys(checkboxes)

    return keys.filter((key) => checkboxes[key])
  }

  setChecked = (id, bool) => {
    const checkboxes = {...this.state.checkboxes}

    if (bool) {
      checkboxes[id] = bool
    } else {
      delete checkboxes[id]
    }

    this.setState({checkboxes})
  }

  toggleCheck = (id) => {
    return (checked) => this.setChecked(id, checked)
  }

  get hasValidRecipient() {
    // TODO Validate email/phone
    return this.state.emailOrPhone != ''
  }

  get transferCount() {
    return Object.keys(this.state.checkboxes).length
  }

  cameraPermissions = async() => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA)

    this.setState({hasCameraPermission: status === 'granted'})
  }

  transfer = async() => {
    if (this.state.isSubmitting) {
      return
    }
    this.setState({isSubmitting: true})

    const {checkboxes, emailOrPhone} = this.state
    const ticketIds = Object.keys(checkboxes).filter((key) => checkboxes[key])

    try {
      await this.props.screenProps.store.transferTickets(
        emailOrPhone,
        ticketIds
      )

      const onDismiss = () => {
        this.props.navigation.popToTop()
      }

      Alert.alert(
        'Transfer Complete',
        'Tickets have been successfully transferred!',
        [{text: 'OK', onPress: onDismiss}],
        {onDismiss}
      )
    } catch (error) {
      this.setState({isSubmitting: false})
      throw error
    }
  }

  render() {
    const {navigation} = this.props
    const {checkboxes, showQRModal} = this.state
    const {hasValidRecipient, transferCount} = this

    let disabled = true
    let buttonText = `Transfer ${pluralize(transferCount, 'Ticket')}`

    if (!hasValidRecipient) {
      buttonText = 'Valid Recipient Required'
    } else if (!transferCount) {
      buttonText = 'No Tickets Selected'
    } else {
      disabled = false
    }

    return (
      <Modal>
        <View style={ticketWalletStyles.modalContainer}>
          <QRCodeScanner
            handleBarCodeScanned={this.handleBarCodeScanned}
            toggleModal={this.toggleQRModal}
            modalVisible={showQRModal}
          />
          <Image
            style={ticketWalletStyles.modalBkgdImage}
            source={require('../../assets/account-placeholder-bkgd.png')}
          />
          <View style={ticketWalletStyles.closeModalContainer}>
            <Icon
              style={styles.iconLinkCircle}
              name="close"
              onPress={() => {
                navigation.goBack()
              }}
            />
          </View>

          <View style={modalStyles.contentRoundedWrapper}>
            <View style={styles.container}>
              <View style={styles.flexRowSpaceBetween}>
                <Text style={modalStyles.headerSecondary}>Add Recipient</Text>
                <TouchableHighlight onPress={() => this.toggleQRModal(true)}>
                  <Image
                    style={[
                      ticketTransferStyles.qrCodeSmall,
                      styles.marginLeftTiny,
                    ]}
                    source={qrCodeIcon}
                  />
                </TouchableHighlight>
              </View>
              <TextInput
                keyboardType="email-address"
                style={formStyles.input}
                placeholder="Recipient email or phone or scan"
                searchIcon={{size: 24}}
                underlineColorAndroid="transparent"
                value={this.state.scannedEmail}
                onChangeText={autotrim((emailOrPhone) =>
                  this.setState({emailOrPhone})
                )}
              />
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{paddingTop: 10}}
            >
              {this.tickets.map(({id, ticket_type_name: name}) => (
                <Card key={id}>
                  <View style={styles.flexRowFlexStart}>
                    <CircleCheckBox
                      checked={checkboxes[id]}
                      onToggle={this.toggleCheck(id)}
                      innerColor="#FF20B1"
                      outerColor="#FF20B1"
                      innerSize={15}
                      outerSize={29}
                      styleCheckboxContainer={styles.marginRight}
                    />
                    <View>
                      <Text style={ticketStyles.ticketHolderHeader}>
                        {name}
                      </Text>
                      <Text style={ticketStyles.ticketHolderSubheader}>
                        #{id.slice(-8)}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </ScrollView>
          </View>

          <View style={[styles.buttonContainer, styles.marginHorizontal]}>
            <BusyButton
              style={
                disabled ?
                  [styles.buttonDisabled, modalStyles.bottomRadius] :
                  [styles.button, modalStyles.bottomRadius]
              }
              underlayColor={primaryColor}
              onPress={disabled ? null : (onPress = this.transfer)}
              isBusy={this.state.isSubmitting}
              busyContent={<ActivityIndicator color="#FFF" />}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </BusyButton>
          </View>
        </View>
      </Modal>
    )
  }
}

TransferTickets.propTypes = {
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
}
