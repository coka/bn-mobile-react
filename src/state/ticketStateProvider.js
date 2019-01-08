import {Container} from 'unstated'
import {server, apiErrorAlert} from '../constants/Server'
import {eventDateTimes, eventIsInPast} from '../time'
import {find} from 'lodash'

/* eslint-disable camelcase,space-before-function-paren */

class TicketsContainer extends Container {
  constructor(props = {}) {
    super(props);

    this.state = {
      tickets: [],
      ticketsByEventId: {},
      purchasedTicket: null,
    }
  }

  // Grabbing tickets from orders right now - not preserving any order-level details
  userTickets = async () => {
    try {
      const response = await server.tickets.index()

      const {data, _paging} = response.data; // @TODO: pagination

      // console.log('tickets data', data)

      const ticketsByEventId = {}

      const ticketGroups = {
        upcoming: [],
        past: [],
        transfer: [],
      };

      // @TODO: api data structure will eventually change
      data.forEach((ticketGroup) => {
        const event = ticketGroup[0];
        const tickets = ticketGroup[1];
        const bucket = eventIsInPast(event) ? 'past' : 'upcoming'
        const {event_start, door_time} = eventDateTimes(event)

        event.formattedDate = event_start.toFormat('EEE, MMMM d')
        event.formattedDoors = door_time.toFormat('t')
        event.formattedStart = event_start.toFormat('t')

        const eventAndTicketsObject = {event, tickets}

        ticketsByEventId[event.id] = eventAndTicketsObject
        ticketGroups[bucket].push(eventAndTicketsObject);
      });

      this.setState({tickets: ticketGroups, ticketsByEventId});

    } catch (error) {
      apiErrorAlert(error, 'Loading tickets failed.')
    }
  }

  setPurchasedTicket = (purchasedTicket) => {
    this.setState({purchasedTicket})
  }

  ticketsForEvent = (eventId) => {
    return this.state.ticketsByEventId[eventId]
  }

  redeemTicketInfo = async (ticket_id) => { // eslint-disable-line complexity
    try {

      const response = await server.tickets.redeem.read({ticket_id})

      return response.data;
    } catch (error) {
      apiErrorAlert(error, 'Creating QR code failed failed.')
    }
  }
}

export {
  TicketsContainer,
}
