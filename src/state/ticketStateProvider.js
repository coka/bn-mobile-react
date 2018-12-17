import {Container} from 'unstated'
import {server, apiErrorAlert} from '../constants/Server'
import {DateTime} from 'luxon'
import {find} from 'lodash'

/* eslint-disable camelcase,space-before-function-paren */

class TicketsContainer extends Container {
  constructor(props = {}) {
    super(props);

    this.state = {
      tickets: [],
      ticketsByEventId: {},
      purchasedTicket: null,
    };

    this.userTickets()
  }

  // Grabbing tickets from orders right now - not preserving any order-level details
  userTickets = async () => {
    try {
      const response = await server.tickets.index()

      const {data, _paging} = response.data; // @TODO: pagination

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
        const bucket = DateTime.fromISO(event.event_start) < DateTime.local() ? 'past' : 'upcoming'

        event.formattedDate = DateTime.fromISO(event.event_start).toFormat('EEE, MMMM d');
        event.formattedDoors = DateTime.fromISO(event.door_time).toFormat('t');
        event.formattedShow = DateTime.fromISO(event.event_start).toFormat('t');

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
