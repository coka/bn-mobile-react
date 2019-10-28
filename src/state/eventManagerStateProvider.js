import { Container } from 'unstated'
import { apiErrorAlert, defaultEventSort, server } from '../constants/Server'

const LIMIT = 50

const hasMoreItems = (page, itemsPerPage, totalItems) =>
  totalItems - (page + 1) * itemsPerPage > 0

export class EventManagerContainer extends Container {
  debounce = 0
  state = {
    events: [],
    eventToScan: {},
    guests: [],
    isFetchingGuests: false,
    isFetchingPage: false,
    guestListQuery: '',
    totalNumberOfGuests: 0,
    page: 0,
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

  fetchGuestList = async () => {
    const { eventToScan, guestListQuery } = this.state
    this.setState({ isFetchingGuests: true })
    try {
      const { data } = await server.events.guests.index({
        event_id: eventToScan.id,
        query: guestListQuery,
        limit: LIMIT,
        page: 0,
      })
      if (this.state.guestListQuery === guestListQuery) {
        this.setState({
          guests: data.data,
          isFetchingGuests: false,
          totalNumberOfGuests: data.paging.total,
          page: 0,
        })
      }
    } catch {
      apiErrorAlert(error)
    }
  }

  fetchNextPage = async () => {
    const {
      eventToScan,
      guestListQuery,
      isFetchingPage,
      page,
      totalNumberOfGuests,
    } = this.state
    if (hasMoreItems(page, LIMIT, totalNumberOfGuests) && !isFetchingPage) {
      this.setState({ isFetchingPage: true })
      const nextPage = page + 1
      try {
        const { data } = await server.events.guests.index({
          event_id: eventToScan.id,
          query: guestListQuery,
          limit: LIMIT,
          page: nextPage,
        })
        if (this.state.guestListQuery === guestListQuery) {
          this.setState(({ guests }) => ({
            guests: guests.concat(data.data),
            isFetchingPage: false,
            totalNumberOfGuests: data.paging.total,
            page: nextPage,
          }))
        }
      } catch {
        apiErrorAlert(error)
      }
    }
  }

  updateSearchQuery = (query) => {
    this.setState({ guestListQuery: query })
    clearTimeout(this.debounce)
    this.debounce = setTimeout(() => this.fetchGuestList(), 250)
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
