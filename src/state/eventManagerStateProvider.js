import { Container } from 'unstated'
import { server, apiErrorAlert, defaultEventSort } from '../constants/Server'

/* eslint-disable camelcase,space-before-function-paren */
const LIMIT = 50

export class EventManagerContainer extends Container {
  constructor(props = {}) {
    super(props)

    this.state = {
      events: [],
      eventToScan: {},
      guests: [],
      isFetchingGuests: false,
      guestListQuery: '',
      totalNumberOfGuests: 0,
      page: 0,

    }
  }

  get events() {
    return this.state.events
  }

  get hasNextPage() {
    const { totalNumberOfGuests, page } = this.state

    if (totalNumberOfGuests && totalNumberOfGuests > 0) {
      return totalNumberOfGuests - (page + 1) * LIMIT > 0
    }
    return false
  }

  fetchNextPage = async () => {
    await this.setState((state) => {
      return { page: state.page + 1 }
    })
    this.searchGuestList()
  }

  refreshParams = () => {
    this.setState({ page: 0 })
  }

  // TODO: filter by live vs upcoming?
  getEvents = async () => {
    try {
      const { data } = await server.events.checkins(defaultEventSort)

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
    this.setState({ eventToScan: event, guests: [] })
  }

  searchGuestList = async (guestListQuery = '', page = this.state.page, replaceGuests = false) => {

    await this.setState({ isFetchingGuests: true, guestListQuery })

    const { id } = this.state.eventToScan
    const { guests } = this.state
    try {
      const { data } = await server.events.guests.index({
        event_id: id,
        query: guestListQuery,
        limit: LIMIT,
        page,
      })

      replaceGuests ?
        this.setState({
          guests: data.data
        }) :
        this.setState({
          totalNumberOfGuests: data.paging.total,
          guests: guests.concat(data.data),
        })

    } catch (error) {
      apiErrorAlert(error)
    }

    await this.setState({ isFetchingGuests: false })
  }

  updateGuestStatus = (guestId, newStatus) => {
    const guests = this.state.guests.slice(0)

    for (let i = 0; i < guests.length; i++) {
      if (guests[i].id === guestId) {
        guests[i].status = newStatus
        break
      }
    }
  }

  // this just unpacks the barcode scanner result, nothing else
  readCode = ({ data: json }) => {
    const { data } = JSON.parse(json)

    if (!data.redeem_key) {
      throw new Error('missing_redeem_key')
    }

    return data
  }

  // we need to display more ticket info sometimes
  getTicketDetails = async ({ id }) => {
    return (await server.tickets.read({ id })).data
  }

  // take the data we got from `readCode` and actually redeem that ticket
  redeem = async ({ id: ticket_id, redeem_key }) => {
    await server.events.tickets.redeem({
      event_id: this.state.eventToScan.id,
      ticket_id,
      redeem_key,
    })
  }
}
