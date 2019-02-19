import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {ScrollView, Text, View, Image, Modal, ActivityIndicator, TouchableHighlight, KeyboardAvoidingView} from 'react-native'
import {WebBrowser} from 'expo';
import {NavigationActions, StackActions, NavigationEvents} from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import EventDetailsStyles from '../styles/event_details/eventDetailsStyles'
import Details from './details'
import GetTickets from './tickets'
import PaymentTypes from './payments'
import Checkout from './checkout'
import ModalStyles from '../styles/shared/modalStyles'
import {toDollars} from '../constants/money'
import {server, apiErrorAlert} from '../constants/Server'
import {min, max, isEmpty, uniq} from 'lodash'
import {optimizeCloudinaryImage} from '../cloudinary'

const styles = SharedStyles.createStyles()
const eventDetailsStyles = EventDetailsStyles.createStyles()
const modalStyles = ModalStyles.createStyles()

/* eslint-disable camelcase, space-before-function-paren */
function priceRangeString(ticket_types) {
  if (!ticket_types) {
    return null
  }

  const prices = ticket_types
    .map(({ticket_pricing: pricing}) => pricing)
    .filter((pricing) => pricing !== null)
    .map(({price_in_cents: cents}) => cents)

  if (!prices.length) {
    return null
  }

  return uniq([min(prices), max(prices)]).map((cents) => `$${toDollars(cents, 0)}`).join(' - ')
}


const LoadingScreen = ({toggleModal, modalVisible}) => (
  <Modal
    onRequestClose={() => {
      toggleModal(!modalVisible)
    }}
    visible={modalVisible}
    transparent
  >
    <View style={modalStyles.modalContainer}>
      <View style={styles.flexRowCenter}>
        <View style={modalStyles.activityIndicator}>
          <ActivityIndicator size="large" color="#FF20B1" />
        </View>
      </View>
    </View>
  </Modal>
)

LoadingScreen.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
}

const SuccessScreen = ({toggleModal, modalVisible}) => (
  <Modal
    onRequestClose={() => {
      toggleModal(!modalVisible)
    }}
    visible={modalVisible}
    transparent
  >
    <View style={modalStyles.modalContainer}>
      <View style={styles.flexRowCenter}>
        <View style={modalStyles.activityIndicator}>
          <Image
            style={modalStyles.emojiActivityIndicator}
            source={require('../../assets/emoji-loader.png')}
          />
        </View>
      </View>
    </View>
  </Modal>
)

SuccessScreen.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
}

function CheckoutButton({onCheckout, disabled, busy}) {
  return (
    <View style={[styles.buttonContainer, eventDetailsStyles.fixedFooter]}>
      <TouchableHighlight
        style={disabled ? styles.buttonDisabled : styles.button}
        onPress={disabled ? null : onCheckout}
      >
        <Text style={styles.buttonText}>{busy ? 'Updating...' : ' Purchase Ticket'}</Text>
      </TouchableHighlight>
    </View>
  )
}

CheckoutButton.propTypes = {
  onCheckout: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  busy: PropTypes.bool,
}

export default class EventShow extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    screenProps: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      event: false,
      eventId: props.navigation.getParam('eventId', false),
      favorite: false,
      currentScreen: 'details',
      showLoadingModal: false,
      showSuccessModal: false,
    }
    this.loadEvent()
  }

  componentWillReceiveProps(newProps) {
    const {screenProps: {store: {state: {selectedEvent}}}} = newProps

    // Do we want to check if the event id different, or just always update?
    if (selectedEvent) {
      this.setState({event: selectedEvent})
    }
  }

  componentDidUpdate(_prevProps, {currentScreen}) {
    if (currentScreen !== this.state.currentScreen) {
      this.scrollToTop()
    }
  }

  scrollToTop() {
    this.scrollView.scrollTo({y: 10, x: 0, animated: true})
  }

  clearEvent() {
    const {screenProps: {store}} = this.props

    store.clearEvent() // @TODO: Test this more - old events still in pop up.
  }

  async loadEvent() {
    const {screenProps: {store, cart}} = this.props
    const {eventId} = this.state

    // Clear any pre-existing cart data from earlier transactions
    await cart.clearCart()

    if (eventId) {
      await store.getEvent(eventId)
    }
  }

  get store() {
    return this.props.screenProps.store
  }

  toggleFavorite = (favorite) => {

    this.setState({favorite})
  }

  changeScreen = (currentScreen) => {
    this.setState({currentScreen})
  }

  selectPayment = async (payment) => {
    await this.props.screenProps.cart.setPayment(payment)
    this.changeScreen('checkout')
  }

  toggleLoadingModal = ({showLoadingModal}) => {
    this.setState({showLoadingModal})
  }

  toggleSuccessModal = ({showSuccessModal}) => {
    this.setState({showSuccessModal})
  }

  get ticketRange() {
    const str = priceRangeString(this.state.event.ticket_types)

    if (!str) {
      return null
    }

    return (
      <View style={eventDetailsStyles.priceHeaderWrapper}>
        <Text style={eventDetailsStyles.priceHeader}>
          {str}
        </Text>
      </View>
    )
  }

  onPromoApply = async (code = '') => {
    if (code === '') {
      alert('You must enter a promotional code.')
      return
    }

    try {
      const response = await server.redemptionCodes.read({code})
      const {data: {ticket_type}} = response

      if (!this.store.ticketTypeIds.includes(ticket_type.id)) {
        alert ('This Promo Code is not valid for this event')
        return
      }

      this.store.replaceTicketType(ticket_type)
    } catch (error) {
      apiErrorAlert(error, 'There was a problem applying this promotional code.')
    }

  }

  onTicketSelection = async (ticketType) => {
    try {
      await this.props.screenProps.cart.setTicketType(ticketType.id, ticketType.redemption_code)
      this.changeScreen('checkout')
    } catch (_error) {
      // something went wrong. error alert should have shown.
    }
  }

  /* eslint-disable-next-line complexity */
  get showScreen() {
    const {event, currentScreen} = this.state
    const {
      screenProps: {
        store: {toggleInterest, ticketsToDisplay},
        cart: {payment},
        user: {access_token, refresh_token},
      },
    } = this.props

    if (!event || isEmpty(event)) {
      return null
    }

    // @TODO: Add a ScrollTo initial position

    switch (currentScreen) {
    case 'details':
      return <Details event={event} onInterested={toggleInterest} />
    case 'tickets':
      return (
        <GetTickets
          event={event}
          ticketsToDisplay={ticketsToDisplay}
          onTicketSelection={this.onTicketSelection}
          changeScreen={this.changeScreen}
          onPromoApply={this.onPromoApply}
        />
      )
    case 'checkout':
      return (
        <Checkout
          cart={this.props.screenProps.cart}
          event={event}
          changeScreen={this.changeScreen}
        />
      )
    case 'payment':
      return (
        <PaymentTypes
          changeScreen={this.changeScreen}
          selectedPaymentDetails={payment}
          selectPayment={this.selectPayment}
          access_token={access_token}
          refresh_token={refresh_token}
        />
      )
    default:
      return <Details />
    }
  }

  get getDetailPageButtonCta() { // eslint-disable-line complexity
    const {event} = this.state

    switch (event.override_status) {
    case 'PurchaseTickets':
      return {ctaText: (!event.is_external ? 'Purchase Tickets' : 'Get Tickets via Web'), enabled: true}
    case 'SoldOut':
      return {ctaText: 'Sold Out', enabled: (event.is_external ? false : true)}
    case 'OnSaleSoon':
      return {ctaText: 'On Sale Soon', enabled: (event.is_external ? false : true)}
    case 'TicketsAtTheDoor':
      return {ctaText: 'Tickets At The Door', enabled: (event.is_external ? false : true)}
    case 'UseAccessCode':
      return {ctaText: (!event.is_external ? 'Use Access Code' : 'Get Tickets via Web'), enabled: true}
    case 'Free':
      return {ctaText: (!event.is_external ? 'Free' : 'Free via Web'), enabled: true}
    case 'Rescheduled':
      return {ctaText: 'Rescheduled', enabled: false}
    case 'Cancelled':
      return {ctaText: 'Cancelled', enabled: false}
    case 'OffSale':
      return {ctaText: 'Off-Sale', enabled: false}
    case 'Ended':
      return {ctaText: 'Sale Ended', enabled: false}
    default:
      return {ctaText: (!event.is_external ? 'Purchase Tickets' : 'Get Tickets via Web'), enabled: true}
    }
  }

  onShowTicket = (event) => {
    return event.is_external ? () => {
      WebBrowser.openBrowserAsync(event.external_url)
    } : () => this.changeScreen('tickets')
  }

  get getTickets() { // eslint-disable-line complexity
    const {event, currentScreen} = this.state
    const {ctaText, enabled} = this.getDetailPageButtonCta

    if (currentScreen === 'details') {
      return (
        <View style={eventDetailsStyles.fixedFooter}>
          {enabled && this.ticketRange}
          <View style={styles.buttonContainer}>
            <TouchableHighlight
              style={enabled ? styles.button : styles.buttonDisabled}
              onPress={enabled ? this.onShowTicket(event) : null}
            >
              <Text style={styles.buttonText}>{ctaText}</Text>
            </TouchableHighlight>
          </View>
        </View>
      )
    }

    return null
  }

  get purchaseTicketButton() {
    if (this.state.currentScreen !== 'checkout') {
      return null
    }

    return (
      <CheckoutButton
        onCheckout={this.purchaseTicket}
        disabled={!this.props.screenProps.cart.canPlaceOrder}
        busy={this.props.screenProps.cart.isChangingQuantity}
      />
    )
  }

  purchaseTicket = async () => {
    const {screenProps: {cart, setPurchasedTicket}, navigation: {navigate}} = this.props

    if (cart.totalCents && !cart.payment) {
      alert('Please enter your payment details');
      return false
    }

    this.setState({showLoadingModal: true})
    try {
      await cart.placeOrder()
      setPurchasedTicket(cart.id)

      await this.setState({
        showLoadingModal: false,
        showSuccessModal: true,
      })

      const resetAction = StackActions.reset({
        index: 0,
        key: 'Explore',
        actions: [
          NavigationActions.navigate({routeName: 'Home'}),
        ],
      })

      setTimeout(() => {
        this.props.navigation.dispatch(resetAction)

        // Navigate to the tickets tab to see the new ticket
        navigate('MyTicketList', {activeTab: 'upcoming'})
      }, 3000)
    } finally {
      this.setState({showLoadingModal: false})
    }
  }


  /* eslint-disable-next-line complexity */
  get prevScreen() {
    const {navigation} = this.props
    const {currentScreen} = this.state

    switch (currentScreen) {
    case 'details':
      return navigation.goBack()
    case 'tickets':
      return this.changeScreen('details')
    case 'checkout':
      return this.changeScreen('tickets')
    case 'payment':
      return this.changeScreen('checkout')
    default:
      return navigation.goBack()
    }
  }

  get backArrow() {
    const {currentScreen} = this.state
    const icon = currentScreen === 'details' ? 'close' : 'arrow-back'

    return (
      <TouchableHighlight style={eventDetailsStyles.linkContainer} underlayColor="rgba(0, 0, 0, 0)" onPress={() => this.prevScreen}>
        <View style={eventDetailsStyles.backArrowCircleContainer}>
          <Icon
            style={eventDetailsStyles.backArrow}
            name={icon}
          />
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    const {event, showLoadingModal, showSuccessModal} = this.state

    if (!event) {
      return null
    }

    return (
      <View style={{backgroundColor: 'white'}}>
        <NavigationEvents
          onWillFocus={() => this.loadEvent()}
          onDidBlur={() => this.clearEvent()}
        />
        <LoadingScreen toggleModal={this.toggleLoadingModal} modalVisible={showLoadingModal} />
        <SuccessScreen toggleModal={this.toggleSuccessModal} modalVisible={showSuccessModal} />
        <Image
          style={eventDetailsStyles.videoBkgd}
          source={{uri: optimizeCloudinaryImage(event.promo_image_url)}}
        />
        <KeyboardAvoidingView behavior="padding" enabled>
          <ScrollView ref={c => (this.scrollView = c)} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {this.showScreen}
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={eventDetailsStyles.backArrowWrapper}>
          {this.backArrow}
        </View>

        {this.getTickets}
        {this.purchaseTicketButton}
      </View>
    )
  }
}
