import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Alert, Image, Text, TouchableHighlight, View } from 'react-native'
import { Image as CachedImage } from 'react-native-expo-image-cache'
import QRCode from 'react-native-qrcode'
import Icon from 'react-native-vector-icons/MaterialIcons'
import imageOverlay from '../../assets/event-img-overlay.png'
import { openVenueDirections } from '../directions'
import SharedStyles from '../styles/shared/sharedStyles'
import TicketStyles from '../styles/tickets/ticketStyles'
import TicketWalletStyles from '../styles/tickets/ticketWalletStyles'

const styles = SharedStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()
const ticketWalletStyles = TicketWalletStyles.createStyles()

function TicketBottomRow({ children }) {
  return <View style={ticketWalletStyles.bottomNav}>{children}</View>
}

function staticBottomText(text) {
  return (
    <View style={ticketWalletStyles.bottomNavLinkContainer}>
      <Text style={ticketWalletStyles.bottomNavLinkText}>{text}</Text>
    </View>
  )
}

export default class Ticket extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    ticket: PropTypes.object.isRequired,
    activeTab: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = {
      qrText: '',
      firstName: '',
      lastName: '',
      redeem_key: '',
    }
  }

  componentDidMount() {
    this.ticketDetails()
  }

  get skipQR() {
    const { redeem_key } = this.state

    return (
      !redeem_key ||
      redeem_key === '' ||
      this.props.ticket.status === 'Redeemed'
    )
  }

  buildQRText() {
    const { redeem_key } = this.state
    const {
      ticket: { ticketId, eventId },
    } = this.props

    if (this.skipQR) {
      return
    }

    const qrObj = {
      type: 0,
      data: { redeem_key, id: ticketId, event_id: eventId, extra: '' },
    }

    this.setState({ qrText: JSON.stringify(qrObj) })
  }

  async ticketDetails() {
    const { redeemTicketInfo, ticket } = this.props
    const details = await redeemTicketInfo(ticket.ticketId)

    if (details) {
      this.setState(
        {
          firstName: details.first_name,
          lastName: details.last_name,
          redeem_key: details.redeem_key,
        },
        () => {
          this.buildQRText()
        }
      )
    }
  }

  handleCancelTransferTicket = async () => {
    try {
      const { cancelTicketTransfer, ticket, navigation } = this.props
      await cancelTicketTransfer(ticket)

      const onDismiss = () => {
        navigation.pop()
      }

      Alert.alert(
        'Transfer Cancelled',
        'The transfer has been successfully cancelled!',
        [{ text: 'OK', onPress: onDismiss }]
      )
    } catch (error) {}
  }

  get upcomingTabText() {
    const { navigation, ticket, activeTab } = this.props
    const { eventId, ticketId, status } = ticket
    const { firstName, lastName } = this.state

    if (status === 'Redeemed') {
      return staticBottomText('Redeemed')
    } else {
      return (
        <View>
          <TouchableHighlight
            underlayColor="rgba(0, 0, 0, 0)"
            onPress={() =>
              navigation.navigate('TransferTickets', {
                activeTab,
                ticketId,
                eventId,
                firstName,
                lastName,
              })
            }
          >
            <View style={ticketWalletStyles.bottomNavLinkContainer}>
              <Text style={ticketWalletStyles.bottomNavLinkText}>
                TRANSFER TICKET
              </Text>
              <Icon style={ticketWalletStyles.bottomNavIcon} name="launch" />
            </View>
          </TouchableHighlight>
        </View>
      )
    }
  }

  get transferBottomText() {
    return (
      <View>
        <TouchableHighlight
          underlayColor="rgba(0, 0, 0, 0)"
          onPress={this.handleCancelTransferTicket}
        >
          <View style={ticketWalletStyles.bottomNavLinkContainer}>
            <Text style={ticketWalletStyles.bottomNavLinkText}>
              CANCEL TRANSFER
            </Text>
            <Icon style={ticketWalletStyles.bottomNavIcon} name="launch" />
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  renderBottomRow = (status) => {
    const { activeTab } = this.props
    switch (activeTab) {
      case 'upcoming':
        return this.upcomingTabText
      case 'past':
        return staticBottomText(
          status === 'Redeemed' ? 'Redeemed' : 'This event has ended'
        )
      case 'transfer':
        return this.transferBottomText
      default:
        return null
    }
  }

  renderQrContainer() {
    const { ticket, activeTab } = this.props
    const { qrText } = this.state

    if (activeTab === 'upcoming') {
      if (qrText) {
        return (
          // https://github.com/cssivision/react-native-qrcode/issues/68
          // Fix from https://github.com/cssivision/react-native-qrcode/issues/68#issuecomment-455791280
          <View style={{ overflow: 'hidden' }}>
            <QRCode size={200} fgColor="white" bgColor="black" value={qrText} />
          </View>
        )
      } else {
        return (
          <View style={ticketWalletStyles.placeholderCard}>
            <Text
              style={[ticketWalletStyles.placeholderText, styles.paddingBottom]}
            >
              To protect you and your purchase against fraudulent activity the
              QR code used to grant access to the event will be hidden until
              closer to the event door time.
            </Text>
            <Text style={ticketWalletStyles.placeholderText}>
              Screenshots of this ticket may not be honored by the venue.
            </Text>
          </View>
        )
      }
    } else if (activeTab === 'transfer') {
      return (
        <View style={ticketWalletStyles.placeholderCard}>
          <Text
            style={[
              ticketWalletStyles.placeholderText,
              styles.paddingBottom,
              styles.helpText,
            ]}
          >
            Transferred to: {ticket.transferAddress || ''}
          </Text>
        </View>
      )
    } else {
      return (
        <Image
          style={{ width: 150, height: 150 }}
          source={require('../../assets/heart-white.png')}
        />
      )
    }
  }

  render() {
    const { ticket } = this.props
    const { firstName, lastName } = this.state

    return (
      <View>
        <View style={ticketStyles.ticketContainer}>
          <View style={ticketWalletStyles.eventImageWrapper}>
            <CachedImage
              style={ticketWalletStyles.eventImage}
              uri={ticket.image}
            />
            <Image
              style={ticketStyles.eventImageOverlay}
              source={imageOverlay}
            />
          </View>
          <View style={ticketStyles.detailsContainer}>
            <View>
              <View style={styles.iconLinkContainer}>
                <Image
                  style={styles.iconImage}
                  source={require('../../assets/heart-white.png')}
                />
              </View>
            </View>
            <View>
              <Text numberOfLines={1} style={ticketStyles.header}>
                {ticket.name}
              </Text>
              <Text numberOfLines={1} style={ticketWalletStyles.details}>
                {ticket.date} &bull; {ticket.starts} &bull; {ticket.venue}
              </Text>
              <TouchableHighlight
                onPress={() => openVenueDirections(ticket.venue)}
              >
                <View style={styles.iconLinkContainer}>
                  <Text style={ticketWalletStyles.iconLinkText}>
                    GET DIRECTIONS
                  </Text>
                  <Icon style={ticketWalletStyles.iconLink} name="call-made" />
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style={ticketWalletStyles.ticketContainerBottom}>
          <View style={[styles.flexRowFlexStartCenter]}>
            <View>
              <Text style={ticketStyles.ticketHolderHeader}>
                {ticket.ticketType}
              </Text>
              <Text style={ticketStyles.ticketHolderSubheader}>
                {firstName} {lastName}
              </Text>
            </View>
          </View>
        </View>

        <View style={ticketWalletStyles.qrCodeContainer}>
          {this.renderQrContainer()}
        </View>

        <TicketBottomRow>{this.renderBottomRow(ticket.status)}</TicketBottomRow>
      </View>
    )
  }
}
