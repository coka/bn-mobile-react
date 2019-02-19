import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Text, View, Linking, Platform, Image, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import QRCode from 'react-native-qrcode';
import imageOverlay from '../../assets/event-img-overlay.png'

import TicketStyles from '../styles/tickets/ticketStyles'
import SharedStyles from '../styles/shared/sharedStyles'
import TicketWalletStyles from '../styles/tickets/ticketWalletStyles'

const styles = SharedStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()
const ticketWalletStyles = TicketWalletStyles.createStyles()

/* eslint-disable camelcase */

function TicketBottomRow({children}) {
  return (
    <View style={ticketWalletStyles.bottomNav}>
      {false && // TODO: Re-enable when functionality is implemented -- issue #253
        <View style={[ticketWalletStyles.bottomNavLinkContainer, styles.borderRight]}>
          <Icon style={ticketWalletStyles.bottomNavIcon} name="account-balance-wallet" />
          <Text style={ticketWalletStyles.bottomNavLinkText}>ADD TO WALLET</Text>
        </View>
      }
      {children}
    </View>
  )
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
    navigate: PropTypes.func.isRequired,
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

  buildQRText() {
    const {redeem_key} = this.state
    const {ticket: {status, ticketId, eventId}} = this.props

    if (status === 'Redeemed') {
      return
    }

    const qrObj = {type: 0, data: {redeem_key, id: ticketId, event_id: eventId, extra: ''}};

    this.setState({qrText: JSON.stringify(qrObj)})
  }

  async ticketDetails() {
    const {redeemTicketInfo, ticket} = this.props
    const details = await redeemTicketInfo(ticket.ticketId)

    this.setState({
      firstName: details.first_name,
      lastName: details.last_name,
      redeem_key: details.redeem_key,
    }, () => {
      this.buildQRText()
    })
  }

  openVenueDirections = () => {
    const {ticket} = this.props
    const {venue} = ticket
    const daddr = encodeURIComponent(`${venue.address} ${venue.postal_code}, ${venue.city}, ${venue.country}`);

    if (Platform.OS === 'ios') {
      Linking.openURL(`http://maps.apple.com/?daddr=${daddr}`);
    } else {
      Linking.openURL(`http://maps.google.com/?daddr=${daddr}`);
    }
  }



  get bottomText() {
    const {navigate, ticket, activeTab} = this.props
    const {eventId, ticketId, status} = ticket
    const {firstName, lastName} = this.state

    switch (activeTab) {
    case 'upcoming':
      if (status === 'Redeemed') {
        return staticBottomText('Redeemed')
      } else {
        return (
          <TouchableHighlight
            underlayColor="rgba(0, 0, 0, 0)"
            onPress={
              () => navigate('TransferTickets', {activeTab, ticketId, eventId, firstName, lastName})
            }
          >
            <View style={ticketWalletStyles.bottomNavLinkContainer}>
              <Text style={ticketWalletStyles.bottomNavLinkText}>TRANSFER TICKET</Text>
              <Icon style={ticketWalletStyles.bottomNavIcon} name="launch" />
            </View>
          </TouchableHighlight>
        )
      }
    case 'past':
      return staticBottomText('This event has ended')
    case 'transfer':
      return staticBottomText('This ticket was transferred')
    default:
      return null
    }
  }

  get qrContainer() {
    const {activeTab} = this.props

    return (
      <View style={ticketWalletStyles.qrCodeContainer}>
        {activeTab === 'upcoming' && this.state.qrText ? (
          <QRCode
            size={200}
            fgColor="white"
            bgColor="black"
            value={this.state.qrText}
          />
        ) : (
          <Image
            style={{width: 150, height: 150}}
            source={require('../../assets/heart-white.png')}
          />
        )}
      </View>
    )
  }

  render() {
    const {ticket} = this.props
    const {firstName, lastName} = this.state

    return (
      <View>
        <View style={ticketStyles.ticketContainer}>
          <View style={ticketWalletStyles.eventImageWrapper}>
            <Image
              style={ticketWalletStyles.eventImage}
              source={{uri: ticket.image}}
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
              <Text numberOfLines={1} style={ticketStyles.header}>{ticket.name}</Text>
              <Text numberOfLines={1} style={ticketWalletStyles.details}>{ticket.date} &bull; {ticket.starts} &bull; {ticket.venue}</Text>
              <TouchableHighlight onPress={this.openVenueDirections}>
                <View style={styles.iconLinkContainer}>
                  <Text style={ticketWalletStyles.iconLinkText}>GET DIRECTIONS</Text>
                  <Icon style={ticketWalletStyles.iconLink} name="call-made" />
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style={ticketWalletStyles.ticketContainerBottom}>
          <View style={[styles.flexRowFlexStartCenter, styles.padding]}>
            {false && // TODO: Re-enable when functionality is implemented.
            <View style={ticketWalletStyles.avatarContainer}>
              <Image
                style={ticketWalletStyles.avatar}
                source={require('../../assets/avatar-female.png')}
              />
            </View>
            }
            <View>
              <Text style={ticketStyles.ticketHolderHeader}>{ticket.ticketType}</Text>
              <Text style={ticketStyles.ticketHolderSubheader}>{firstName} {lastName}</Text>
            </View>
          </View>
        </View>

        {this.qrContainer}

        <TicketBottomRow>{this.bottomText}</TicketBottomRow>
      </View>
    )
  }
}
