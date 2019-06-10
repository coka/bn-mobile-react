import {Container} from 'unstated'
import {server, apiErrorAlert} from '../constants/Server'
import {eventDateTimes, eventIsInPast} from '../time'

/* eslint-disable camelcase,space-before-function-paren */

class TicketsContainer extends Container {
  constructor(props = {}) {
    super(props)

    this.state = {
      tickets: [],
      purchasedTicket: null,
    }
  }

  // Grabbing tickets from orders right now - not preserving any order-level details
  userTickets = async () => {
    try {
      const response = await server.tickets.index()
      const {data, _paging} = response.data // @TODO: pagination
      const tabData = {
        upcoming: [],
        past: [],
        transfer: [],
      }

      data.forEach(([event, tix]) => {
        const untransferredCategory = eventIsInPast(event) ? 'past' : 'upcoming'
        const {event_start, door_time} = eventDateTimes(event.localized_times)

        event.formattedDate = event_start.toFormat('EEE, MMMM d')
        event.formattedDoors = door_time.toFormat('t')
        event.formattedStart = event_start.toFormat('t')

        const categories = {
          upcoming: [],
          past: [],
          transfer: [],
        }

        tix.forEach((ticket) => {
          categories[
            ticket.pending_transfer ? 'transfer' : untransferredCategory
          ].push(ticket)
        })

        Object.keys(categories).forEach((key) => {
          const tickets = categories[key]

          if (tickets.length) {
            tabData[key].push({event, tickets})
          }
        })
      })

      // sort past events in reverse order
      tabData.past = tabData.past.reverse()

      this.setState({tickets: tabData})
    } catch (error) {
      apiErrorAlert(error, 'Loading tickets failed.')
    }
  }

  setPurchasedTicket = (purchasedTicket) => {
    this.setState({purchasedTicket})
  }

  ticketsForEvent = (activeTab, eventId) => {
    return this.state.tickets[activeTab || 'upcoming'].find(
      ({event: {id}}) => id === eventId
    )
  }

  redeemTicketInfo = async (ticket_id) => {
    // eslint-disable-line complexity
    try {
      const response = await server.tickets.redeem.read({ticket_id})

      return response.data
    } catch (error) {
      apiErrorAlert(error, 'Creating QR code failed.')
      return null
    }
  }

  transferTickets = async (emailOrPhone, ticketIds) => {
    const payload = {
      email: '', // There's a bug in the API lib that's asking for this, but the server uses email_or_phone
      email_or_phone: emailOrPhone,
      ticket_ids: ticketIds,
      validity_period_in_seconds: 60 * 60 * 24, // TODO make this config based
    }

    await server.tickets.transfer.send(payload)
  }
}

export {TicketsContainer}
