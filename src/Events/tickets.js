import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  TouchableHighlight,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native'
import {MaterialIcons} from '@expo/vector-icons'
import {Ticket} from './event_ticket'
import CheckoutStyles from '../styles/event_details/checkoutStyles'
import TicketStyles from '../styles/tickets/ticketStyles'
import FormStyles from '../styles/shared/formStyles'
import SharedStyles from '../styles/shared/sharedStyles'
import emptyState from '../../assets/icon-empty-state.png'
import {server, apiErrorAlert} from '../constants/Server'
import {LoadingScreen} from '../constants/modals'
import {autotrim} from '../string'

const styles = SharedStyles.createStyles()
const formStyles = FormStyles.createStyles()
const checkoutStyles = CheckoutStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()

/* eslint-disable camelcase, space-before-function-paren */

export default class GetTickets extends Component {
  static propTypes = {
    onTicketSelection: PropTypes.func,
    event: PropTypes.object,
    ticketsToDisplay: PropTypes.array,
    store: PropTypes.object,
  }

  state = {
    promoCode: '',
    applyingPromo: false,
  }

  onPromoApply = async (code = '') => {
    if (code === '') {
      Alert.alert('Error', 'You must enter a promotional code.')
      return
    }

    try {
      this.setState({applyingPromo: true})
      const response = await server.redemptionCodes.read({code})
      const {
        data: {
          // @deprecated
          ticket_type,
          ticket_types = [],
        },
      } = response
      const {event, store} = this.props

      // This can be replaced by ticket_types once we are at parity with the server
      const ticket_types_to_process = ticket_types
        .concat(ticket_type)
        .filter((ticket_type) => !!ticket_type)

      ticket_types_to_process.forEach((ticket_type) => {
        if (
          !store.ticketTypeIds.includes(ticket_type.id) &&
          ticket_type.event_id !== event.id
        ) {
          Alert.alert('Error', 'This Promo Code is not valid for this event')
          return
        }

        store.replaceTicketType(ticket_type)
      })
    } catch (error) {
      setTimeout(() => {
        apiErrorAlert(
          error,
          'There was a problem applying this promotional code.'
        )
      }, 600)
    } finally {
      this.setState({applyingPromo: false})
    }
  }

  onPromoRemove = async (eventId) => {
    try {
      this.setState({applyingPromo: true, promoCode: ''})
      await this.props.store.getEvent(eventId)
    } catch (error) {
      setTimeout(() => {
        apiErrorAlert(
          error,
          'There was a problem applying this promotional code.'
        )
      }, 600)
    } finally {
      this.setState({applyingPromo: false})
    }
  }

  handlePromoSubmit = () => {
    this.onPromoApply(this.state.promoCode)
  }

  handleRemovePromoSubmit = () => {
    this.onPromoRemove(this.props.event.id)
  }

  get hasTickets() {
    return this.props.ticketsToDisplay.length > 0
  }

  get ticketList() {
    return this.props.ticketsToDisplay.map((ticket) => (
      <Ticket
        key={ticket.id}
        ticket={ticket}
        onTicketSelection={this.props.onTicketSelection}
      />
    ))
  }

  get noAvailableTickets() {
    return (
      <View>
        <View style={ticketStyles.emptyStateContainer}>
          <Image style={ticketStyles.emptyStateIcon} source={emptyState} />
          <Text style={ticketStyles.emptyStateText}>
            Looks like there are no tickets available at this time.
          </Text>
        </View>
        <View style={ticketStyles.noTicketsPromoContainer}>
          {this.promoCode}
        </View>
      </View>
    )
  }

  promoCodeApplied() {
    return (
      this.props.ticketsToDisplay.findIndex(
        (ticket) => ticket.redemption_code !== null
      ) >= 0
    )
  }

  get promoCode() {
    const isPromoCodeApplied = this.promoCodeApplied()

    return (
      <View style={styles.container}>
        <Text style={checkoutStyles.ticketHeader}>Promo Code</Text>
        {isPromoCodeApplied ? (
          <View style={[checkoutStyles.rowContainer, styles.marginBottom]}>
            <View style={[styles.flexRowSpaceBetween, styles.flex1]}>
              <Text style={checkoutStyles.ticketSubHeaderPink}>
                {this.state.promoCode}
              </Text>
              <MaterialIcons
                style={checkoutStyles.iconCheck}
                name="check-circle"
              />
            </View>
          </View>
        ) : (
          <TextInput
            editable={!isPromoCodeApplied}
            keyboardShouldPersistTaps="always"
            style={[formStyles.input, styles.marginTop]}
            placeholder="Enter a Promo Code"
            onChangeText={autotrim((promoCode) => this.setState({promoCode}))}
          />
        )}

        <View style={styles.buttonContainer}>
          <TouchableHighlight
            underlayColor="rgba(255, 34, 178, 0.2)"
            keyboardShouldPersistTaps="always"
            onPress={
              isPromoCodeApplied ?
                this.handleRemovePromoSubmit :
                this.handlePromoSubmit
            }
            style={checkoutStyles.buttonSecondary}
          >
            <Text style={styles.buttonSecondaryText}>
              {isPromoCodeApplied ? 'Remove Promo Code' : 'Apply Promo Code'}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  get hasTicketDisplay() {
    return (
      <ScrollView>
        <View>
          <View style={checkoutStyles.headerWrapper}>
            <Text style={checkoutStyles.header}>Select Ticket Type</Text>
          </View>
          {this.ticketList}
          {this.promoCode}
        </View>
      </ScrollView>
    )
  }

  render() {
    return (
      <View style={checkoutStyles.mainBody}>
        <LoadingScreen visible={this.state.applyingPromo} />
        <View style={checkoutStyles.mainBodyContent}>
          {this.hasTickets ? this.hasTicketDisplay : this.noAvailableTickets}
        </View>
      </View>
    )
  }
}
