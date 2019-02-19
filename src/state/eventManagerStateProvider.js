import {Container} from 'unstated'
import {server, apiErrorAlert, defaultEventSort} from '../constants/Server'

/* eslint-disable camelcase,space-before-function-paren */
export class EventManagerContainer extends Container {
  constructor(props = {}) {
    super(props);

    this.state = {
      events: [],
      eventToScan: {},
      guests: [],
      isFetchingGuests: false,
      guestListQuery: '',
    }
  }

  get events() {
    return this.state.events
  }

  // TODO: filter by live vs upcoming?
  getEvents = async () => {
    try {

      const {data} = await server.events.checkins(defaultEventSort)

      this.setState({
        // lastUpdate: DateTime.local(),
        events: data.data,
        paging: data.paging,
      })
    } catch (error) {
      apiErrorAlert(error)
    }
  }

  scanForEvent = async (event) => {
    this.setState({eventToScan: event, guests: []});
  }

  searchGuestList = async (guestListQuery = '') => {
    await this.setState({isFetchingGuests: true, guestListQuery})

    const {id} = this.state.eventToScan
    const {data: {data: guests, paging: _paging}} = await server.events.guests.index({event_id: id, query: guestListQuery})

    // Still fetching the same thing? (or subsequently fetched something else?)
    if (this.state.eventToScan.id === id && this.state.guestListQuery === guestListQuery) {
      await this.setState({guests, isFetchingGuests: false})
    }
  }

  // this just unpacks the barcode scanner result, nothing else
  readCode = ({data: json}) => {
    const {data} = JSON.parse(json)

    if (!data.redeem_key) {
      throw new Error('missing_redeem_key')
    }

    return data
  }

  // we need to display more ticket info sometimes
  getTicketDetails = async ({id}) => {
    return (await server.tickets.read({id})).data
  }

  // take the data we got from `readCode` and actually redeem that ticket
  redeem = async ({id: ticket_id, redeem_key}) => {
    await server.events.tickets.redeem({
      event_id: this.state.eventToScan.id,
      ticket_id,
      redeem_key,
    })
  }
}
