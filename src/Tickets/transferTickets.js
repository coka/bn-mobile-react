import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import {
  Modal,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { BarCodeScanner, Permissions, Contacts } from 'expo'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles, { primaryColor } from '../styles/shared/sharedStyles'
import TicketWalletStyles from '../styles/tickets/ticketWalletStyles'
import TicketTransferStyles from '../styles/tickets/ticketTransferStyles'
import ModalStyles from '../styles/shared/modalStyles'
import FormStyles from '../styles/shared/formStyles'
import { autotrim, pluralize, sortArray } from '../string'
import qrCodeIcon from '../../assets/qr-code-small.png'
import BusyButton from '../BusyButton'
import ContactList from './contactList';
import CardItem from './cardItem';

const styles = SharedStyles.createStyles()
const ticketWalletStyles = TicketWalletStyles.createStyles()
const ticketTransferStyles = TicketTransferStyles.createStyles()
const modalStyles = ModalStyles.createStyles()
const formStyles = FormStyles.createStyles()

const QRCodeScanner = ({ toggleModal, modalVisible, handleBarCodeScanned }) => (
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
          style={{ height: 250, width: 250 }}
        />
        <Text style={modalStyles.headerSecondary}>
          Scan the recipients barcode found in their Big Neon account tab.
        </Text>

        <View style={[styles.buttonContainer, { borderRadius: 6 }]}>
          <TouchableOpacity
            style={[styles.button, { borderRadius: 6 }]}
            name="Cancel"
            onPress={() => {
              toggleModal(false)
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
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
      checkboxes: { [props.navigation.state.params.ticketId]: true },
      emailOrPhone: '',
      showQRModal: false,
      hasCameraPermission: null,
      hasContactsPermission: null,
      openContactList: false,
      contacts: null,
    }
  }

  handleBarCodeScanned = async ({ _type, data }) => {
    parsedScan = JSON.parse(data)
    if (this.state.emailOrPhone === parsedScan.email) {
      return
    }
    this.setState({ emailOrPhone: parsedScan.email })
    this.toggleQRModal(false)
  }

  toggleQRModal = (visible) => {
    this.setState({
      showQRModal: visible,
      emailOrPhone: '',
    })
    if (visible && !this.state.hasCameraPermission) {
      this.cameraPermissions()
    }
  }
  get tickets() {
    const {
      navigation: {
        state: {
          params: { activeTab, eventId },
        },
      },
      screenProps: {
        store: { ticketsForEvent },
      },
    } = this.props

    return ticketsForEvent(activeTab, eventId).tickets
  }

  get firstName() {
    const {
      navigation: {
        state: {
          params: { firstName },
        },
      },
    } = this.props

    return firstName
  }

  get lastName() {
    const {
      navigation: {
        state: {
          params: { lastName },
        },
      },
    } = this.props

    return lastName
  }

  get label() {
    return `${this.firstName} ${this.lastName}`
  }

  get transferTickets() {
    const { checkboxes } = this.state
    const keys = Object.keys(checkboxes)

    return keys.filter((key)
      => checkboxes[key])
  }

  setChecked = (id, bool) => {
    const checkboxes = { ...this.state.checkboxes }

    if (bool) {
      checkboxes[id] = bool
    } else {
      delete checkboxes[id]
    }

    this.setState({ checkboxes })
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

  cameraPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)

    this.setState({ hasCameraPermission: status === 'granted' })
  }

  contactsPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CONTACTS)
    this.setState({ hasContactsPermission: status === 'granted' })

  }

  transfer = async () => {
    const { isSubmitting } = this.state;
    const { screenProps, navigation } = this.props;

    if (isSubmitting) {
      return
    }
    this.setState({ isSubmitting: true })

    const { checkboxes, emailOrPhone } = this.state
    const ticketIds = Object.keys(checkboxes).filter((key)
      => checkboxes[key])

    try {
      await screenProps.store.transferTickets(
        emailOrPhone,
        ticketIds
      )

      const onDismiss = () => {
        navigation.popToTop()
      }

      Alert.alert(
        'Transfer Complete',
        'Tickets have been successfully transferred!',
        [{ text: 'OK', onPress: onDismiss }],
        { onDismiss }
      )
    } catch (error) {
      this.setState({ isSubmitting: false })
      throw error
    }
  }

  getContactList = async () => {
    const { hasContactsPermission } = this.state;

    if (!hasContactsPermission) {
      this.contactsPermissions()
    }

    const { data } = await Contacts.getContactsAsync();
    const sortedContacts = sortArray(data, 'name')
    this.setState({ contacts: sortedContacts, openContactList: true })
  }

  closeContactList = () => {
    this.setState({
      openContactList: false,
    })
  }

  selectEmailOrPhone = (emailOrPhone) => {
    this.setState({
      emailOrPhone
    })
    this.closeContactList();
  }


  render() {
    const { navigation } = this.props
    const { isSubmitting, emailOrPhone, checkboxes, showQRModal, openContactList, contacts } = this.state
    const { hasValidRecipient, transferCount } = this

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
      <Modal onRequestClose={navigation.goBack}>
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
              style={[styles.iconLinkCircle, openContactList ? ticketWalletStyles.customContactListPadding : '']}
              name="close"
              onPress={openContactList ?
                () => this.closeContactList() :
                () => navigation.goBack()
              }
            />
          </View>
          {
            !openContactList ?
              <View style={modalStyles.contentRoundedWrapper}>
                <View style={styles.container}>
                  <View style={styles.flexRowSpaceBetween}>
                    <Text style={modalStyles.headerSecondary}>Add Recipient</Text>
                    <TouchableOpacity onPress={() => this.toggleQRModal(true)}>
                      <Image
                        style={[
                          ticketTransferStyles.qrCodeSmall,
                          styles.marginLeftTiny,
                        ]}
                        source={qrCodeIcon}
                      />
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => this.getContactList()}>
                      <Icon style={{ fontSize: 24 }} name="contacts" />
                    </TouchableOpacity> */}
                  </View>
                  <TextInput
                    keyboardType="email-address"
                    style={formStyles.input}
                    placeholder="Recipient email or phone or scan"
                    searchIcon={{ size: 24 }}
                    underlineColorAndroid="transparent"
                    value={emailOrPhone}
                    onChangeText={autotrim((emailOrPhone) =>
                      this.setState({ emailOrPhone })
                    )}
                  />
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ paddingTop: 10 }}
                >
                  {this.tickets.map(({ id, ticket_type_name: name }) => (
                    <CardItem
                      key={id}
                      id={id}
                      name={name}
                      checkboxes={checkboxes}
                      toggleCheck={this.toggleCheck}
                    />
                  ))}
                </ScrollView>
              </View>
              :
              <ContactList contacts={contacts} selectEmailOrPhone={this.selectEmailOrPhone} />
          }
          {!openContactList &&
            <View style={[styles.buttonContainer, styles.marginHorizontal]}>
              <BusyButton
                style={
                  disabled ?
                    [styles.buttonDisabled, modalStyles.bottomRadius] :
                    [styles.button, modalStyles.bottomRadius]
                }
                underlayColor={primaryColor}
                onPress={disabled ? null : (onPress = this.transfer)}
                isBusy={isSubmitting}
                busyContent={<ActivityIndicator color="#FFF" />}
              >
                <Text style={styles.buttonText}>{buttonText}</Text>
              </BusyButton>
            </View>}
        </View>
      </Modal>
    )
  }
}

TransferTickets.propTypes = {
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
}
