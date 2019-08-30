import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    ScrollView,
    Text,
    View,
    Image,
    TouchableHighlight,
    KeyboardAvoidingView,
    Alert,
} from 'react-native'
import * as WebBrowser from 'expo-web-browser';
import {
    NavigationActions,
    StackActions,
    NavigationEvents,
} from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import EventDetailsStyles from '../styles/event_details/eventDetailsStyles'
import Details from './details'
import GetTickets from './tickets'
import PaymentTypes from './payments'
import Checkout from './checkout'
import {toDollars} from '../constants/money'
import {LoadingScreen, SuccessScreen} from '../constants/modals'
import {min, max, isEmpty, uniq} from 'lodash'
import {optimizeCloudinaryImage} from '../cloudinary'

const styles = SharedStyles.createStyles()
const eventDetailsStyles = EventDetailsStyles.createStyles()

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

    return uniq([min(prices), max(prices)])
        .map((cents) => `$${toDollars(cents, 0)}`)
        .join(' - ')
}

function CheckoutButton({onCheckout, disabled, busy}) {
    return (
        <View style={[styles.buttonContainer, eventDetailsStyles.fixedFooter]}>
            <TouchableHighlight
                style={disabled ? styles.buttonDisabled : styles.button}
                onPress={disabled ? null : onCheckout}
            >
                <Text style={styles.buttonText}>
                    {busy ? 'Updating...' : ' Purchase Ticket(s)'}
                </Text>
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
            event: props.navigation.getParam('event', false),
            eventId: props.navigation.getParam('eventId', false),
            currentScreen: 'details',
            showLoadingModal: false,
            showSuccessModal: false,
            success: null,
        }
    }

    componentWillReceiveProps(newProps) {
        const {
            screenProps: {
                store: {
                    state: {selectedEvent},
                },
            },
        } = newProps

        if (selectedEvent.id && selectedEvent.id === this.state.eventId) {
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

    async clearEvent() {
        const {
            screenProps: {store},
        } = this.props

        store.clearEvent()
    }

    async loadEvent() {

        const {
            screenProps: {store, cart},
        } = this.props

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

    changeScreen = (currentScreen) => {
        this.setState({currentScreen})
    }

    selectPayment = async (payment) => {
        await this.props.screenProps.cart.setPayment(payment)
        this.changeScreen('checkout')
    }

    get ticketRange() {
        const str = priceRangeString(this.state.event.ticket_types)

        if (!str) {
            return null
        }

        return (
            <View style={eventDetailsStyles.priceHeaderWrapper}>
                <Text style={eventDetailsStyles.priceHeader}>{str}</Text>
            </View>
        )
    }

    onTicketSelection = async (ticketType) => {
        try {

            await this.props.screenProps.cart.setTicketType(
                ticketType.id,
                ticketType.redemption_code,
                ticketType.increment
            )
            this.changeScreen('checkout')
        } catch (error) {
            // something went wrong. error alert should have shown.
            Alert.alert('Error', 'There was an error choosing this ticket');
            console.error(error);
        }
    }

    /* eslint-disable-next-line complexity */
    get showScreen() {
        const {event, currentScreen} = this.state
        const {
            screenProps: {
                store: {
                    toggleInterest,
                    ticketsToDisplay,
                    eventTickets,
                    state: {
                        loading
                    }
                },
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
                return (
                    <Details
                        event={event}
                        onInterested={toggleInterest}
                        loading={loading}
                    />
                )
            case 'tickets':
                return (
                    <GetTickets
                        event={event}
                        store={this.store}
                        ticketsToDisplay={ticketsToDisplay}
                        onTicketSelection={this.onTicketSelection}
                        changeScreen={this.changeScreen}
                    />
                )
            case 'checkout':
                return (
                    <Checkout
                        cart={this.props.screenProps.cart}
                        event={event}
                        eventTickets={eventTickets}
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
                return <Details/>
        }
    }

    get getDetailPageButtonCta() {
        // eslint-disable-line complexity
        const {event} = this.state

        switch (event.override_status) {
            case 'PurchaseTickets':
                return {
                    ctaText: !event.is_external ?
                        'Purchase Tickets' :
                        'Get Tickets via Web',
                    enabled: true,
                }
            case 'SoldOut':
                return {ctaText: 'Sold Out', enabled: !event.is_external}
            case 'OnSaleSoon':
                return {
                    ctaText: 'On Sale Soon',
                    enabled: !event.is_external,
                }
            case 'TicketsAtTheDoor':
                return {
                    ctaText: 'Tickets At The Door',
                    enabled: !event.is_external,
                }
            case 'UseAccessCode':
                return {
                    ctaText: !event.is_external ?
                        'Use Access Code' :
                        'Get Tickets via Web',
                    enabled: true,
                }
            case 'Free':
                return {
                    ctaText: !event.is_external ? 'Free' : 'Free via Web',
                    enabled: true,
                }
            case 'Rescheduled':
                return {ctaText: 'Rescheduled', enabled: false}
            case 'Cancelled':
                return {ctaText: 'Cancelled', enabled: false}
            case 'OffSale':
                return {ctaText: 'Off-Sale', enabled: false}
            case 'Ended':
                return {ctaText: 'Sale Ended', enabled: false}
            case undefined:
                return {ctaText: 'Fetching Tickets', enabled: false}
            default:
                return {
                    ctaText: !event.is_external ?
                        'Purchase Tickets' :
                        'Get Tickets via Web',
                    enabled: true,
                }
        }
    }

    onShowTicket = (event) => {
        return event.is_external ?
            () => {
                WebBrowser.openBrowserAsync(event.external_url)
            } :
            () => this.changeScreen('tickets')
    }

    get getTickets() {
        // eslint-disable-line complexity
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
                onCheckout={async () => await this.purchaseTicket()}
                disabled={!this.props.screenProps.cart.canPlaceOrder}
                busy={this.props.screenProps.cart.isChangingQuantity}
            />
        )
    }

    purchaseTicket = async () => {
        const {
            screenProps: {cart, setPurchasedTicket},
            navigation: {navigate},
        } = this.props
        const onSuccess = () => this.setState({success: true})
        const onError = (error) => {
            this.setState({showLoadingModal: false, success: false})
        }

        if (cart.totalCents && !cart.payment) {
            Alert.alert('Error', 'Please enter your payment details')
            return false
        }

        this.setState({showLoadingModal: true})
        try {
            await cart.placeOrder(onSuccess, onError)

            if (!this.state.success) {
                return false
            } else {
                setPurchasedTicket(cart.id)
            }

            await this.setState({
                showLoadingModal: false,
                showSuccessModal: true,
            })

            const resetAction = StackActions.reset({
                index: 0,
                key: 'Explore',
                actions: [NavigationActions.navigate({routeName: 'Home'})],
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
            <TouchableHighlight
                style={eventDetailsStyles.linkContainer}
                underlayColor="rgba(0, 0, 0, 0)"
                onPress={() => this.prevScreen}
            >
                <View style={eventDetailsStyles.backArrowCircleContainer}>
                    <Icon style={eventDetailsStyles.backArrow} name={icon}/>
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
                    onDidFocus={async () => this.loadEvent()}
                    onWillBlur={async () => this.clearEvent()}
                />
                <LoadingScreen visible={showLoadingModal}/>
                <SuccessScreen visible={showSuccessModal}/>
                <Image
                    style={eventDetailsStyles.videoBkgd}
                    source={{uri: optimizeCloudinaryImage(event.promo_image_url)}}
                />
                <KeyboardAvoidingView behavior="padding" enabled>
                    <ScrollView
                        ref={(ref) => (this.scrollView = ref)}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
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
