import {Container} from 'unstated'
import {server, apiErrorAlert} from '../constants/Server'

function itemIsTicket({item_type: type}) {
    return type === 'Tickets'
}

function itemIsDiscount({item_type: type}) {
    return type === 'Discount'
}

function sumUnitPrices(items) {
    return items.reduce(
        (sum, {unit_price_in_cents: unitPrice, quantity}) =>
            sum + unitPrice * quantity,
        0
    )
}

/**
 *  Right now, this only does one ticket type for one event
 *  Will require some refactoring if purchasing ever evolve to involve
 *  muliple items ofdifferent types in one cart
 **/

/* eslint-disable camelcase */
class CartContainer extends Container {
    _quantityDebounceKey = false;

    async _resetState() {
        this.state = {
            requestedQuantity: 1,
            isReady: false,
            isChangingQuantity: false,
            ticketTypeId: null,
            ticketPromo: null,
            response: null,
            payment: null,
            items: [],
        }
    }

    constructor() {
        super()
        this._resetState()
    }

    get response() {
        return this.state.response
    }

    get data() {
        return this.response.data
    }

    get id() {
        return this.data.id
    }

    get event() {
        return this.containers.events.selectedEvent
    }

    get ticketType() {
        return this.event.ticket_types.find(({id}) => id === this.ticketTypeId)
    }

    get ticketPromo() {
        return this.state.ticketPromo
    }

    get ticketTypeId() {
        return this.state.ticketTypeId
    }

    get quantity() {
        return this.selectedTicket.quantity
    }

    get requestedQuantity() {
        return this.state.requestedQuantity
    }

    get isReady() {
        return this.state.isReady
    }

    get items() {
        return this.data.items
    }

    get tickets() {
        return this.items.filter(itemIsTicket)
    }

    get fees() {
        return this.items.filter(
            (item) => !itemIsTicket(item) && !itemIsDiscount(item)
        )
    }

    get discounts() {
        return this.items.filter(itemIsDiscount)
    }

    get selectedTicket() {
        return this.tickets.find(({ticket_type_id: id}) => id === this.ticketTypeId)
    }

    get maxAdditionalQuantity() {

        const item = this.data.limited_tickets_remaining.find(
            ({ticket_type_id: id}) => id === this.ticketTypeId
        )

        if (item) {
            return item.tickets_remaining
        } else if (this.ticketType) {
            return Math.max((this.ticketType.limit_per_person || this.ticketType.available) - 1, 0);
        }

        return 0
    }

    get maxCommittableQuantity() {
        return this.quantity + this.maxAdditionalQuantity
    }

    canAddQuantity(qty) {
        const newQuantity = this.requestedQuantity + qty

        return newQuantity > 0 && newQuantity <= this.maxCommittableQuantity
    }

    async clearCart() {
        await this._resetState()
    }

    async addQuantity(qty) {
        return await this.setQuantity(this.requestedQuantity + qty)
    }

    get ticketsCents() {
        return sumUnitPrices(this.tickets)
    }

    get feesCents() {
        return sumUnitPrices(this.fees)
    }

    get discountCents() {
        return sumUnitPrices(this.discounts)
    }

    get totalCents() {
        return this.data.total_in_cents
    }

    get usedPromo() {
        // Return true if any ticket's redemption_code is truthy
        return !!this.tickets.find(
            ({redemption_code: code}) => code === this.ticketPromo
        )
    }

    get promoTickets() {
        return this.tickets.filter((ticket) => !!ticket.redemption_code)
    }

    get replaceParams() {
        return {
            items: [
                {
                    ticket_type_id: this.ticketTypeId,
                    redemption_code: this.ticketPromo,
                    quantity: this.state.requestedQuantity,
                },
            ],
        }
    }

    async _delete() {
        if (this.ticketTypeId && this.isReady) {
            await server.cart.delete(this.ticketTypeId)
        }
        await this._resetState()
    }

    setQuantity(quantity) {
        this.setState({requestedQuantity: quantity, isChangingQuantity: true})
        clearTimeout(this._quantityDebounceKey);
        this._quantityDebounceKey = setTimeout(() => {
            this._commitQuantity()
        }, 300)
    }

    async _commitQuantity() {
        try {
            const response = await server.cart.replace(this.replaceParams)
            // set these first so we can calculate actual quantity

            await this.setState({response, isReady: true})
        } catch (error) {
            apiErrorAlert(error)

            if (this.isReady) {
                await this.setState({requestedQuantity: this.quantity})
                return this.response
            } else {
                throw error
            }
        } finally {
            // if the actual quantity and the requested quantity match, we're probably done updating
            // if they don't match, most likely there's another cart update in progress
            if (this.quantity === this.requestedQuantity) {
                await this.setState({isChangingQuantity: false})
            }
        }
    }

    async setTicketType(ticketTypeId, ticketPromo) {
        await this.setState({ticketTypeId, ticketPromo, requestedQuantity: 1})
        return await this._commitQuantity()
    }

    async setPayment(payment) {
        return await this.setState({payment})
    }

    get payment() {
        return this.state.payment
    }

    // we disable the purchase button and indicate it's busy until this is false
    get isChangingQuantity() {
        return this.state.isChangingQuantity
    }

    // can't place an order until there's payment info and quantity isn't changing anymore
    get canPlaceOrder() {
        return (!this.isChangingQuantity && !this.totalCents) || this.payment
    }

    async placeOrder(onSuccess, onError) {
        const {totalCents: amount} = this
        const method = amount ?
            {
                type: 'Card',
                provider: 'Stripe',
                token: this.payment.id,
                save_payment_method: false,
                set_default: false,
            } :
            {
                type: 'Free',
            }

        try {
            await server.cart.checkout({amount, method})
            onSuccess()
        } catch (error) {
            onError()
            setTimeout(() => {
                apiErrorAlert(error)
            }, 600)
        }
    }
}

export {CartContainer}
