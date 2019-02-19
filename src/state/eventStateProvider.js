import {Container} from 'unstated'
import {server, apiErrorAlert, defaultEventSort} from '../constants/Server'
import {baseURL} from '../constants/config'
import {DateTime} from 'luxon'
import {map} from 'lodash'

const LOCATIONS_FETCH_MIN_MINUTES = 15

const _SAMPLE_AVATARS = [
  require('../../assets/avatar-female.png'),
  require('../../assets/avatar-male.png'),
  require('../../assets/avatar-female.png'),
]

/* eslint-disable complexity,space-before-function-paren,camelcase */

function ticketFilter({status, ticket_pricing}) {
  switch (status) {
  case 'SoldOut':
    return true
  case 'Published':
    return !!ticket_pricing
  default:
    return false
  }
}

function ticketComparator({ticket_pricing: a}, {ticket_pricing: b}) {
  if (a === null && b === null) {
    return 0
  }
  if (a === null) {
    return 1
  }
  if (b === null) {
    return -1
  }
  return b - a
}
class EventsContainer extends Container {

  constructor(props = {}) {
    super(props);

    this.state = {
      events: [],
      eventsById: {},
      ticketTypesById: {},
      paging: {},
      lastUpdate: null,
      locations: [],
      selectedLocationId: null,
      selectedEvent: {},
    };
  }

  get eventsById() {
    return this.state.eventsById
  }

  get ticketTypesById() {
    return this.state.ticketTypesById
  }

  get ticketTypeIds() {
    return map(this.ticketTypesById, (_ticket, id) => id)
  }

  get selectedEvent() {
    return this.state.selectedEvent
  }

  get ticketsToDisplay() {
    const {ticketTypesById} = this.state

    ticketTypes = map(ticketTypesById, (ticket, _id) => ticket)


    return ticketTypes ? ticketTypes.filter(ticketFilter).sort(ticketComparator) : []
  }

  locationsPromise = null
  locationsLastFetched = null

  fetchLocations = async (...args) => {
    // Already fetching. Wait for existing promise to finish.
    if (this.locationsPromise !== null) {
      return await this.locationsPromise
    }
    // Don't fetch more often than is sane.
    if (this.locationsLastFetched && this.locationsLastFetched.plus({minutes: LOCATIONS_FETCH_MIN_MINUTES}) < DateTime.local()) {
      return
    }
    try {
      // Do the fetch, lock fetching, and write down the time when we finished.
      await (this.locationsPromise = this._fetchLocations(...args))
      this.locationsLastFetched = DateTime.local()
    } finally {
      // Always unlock so we can try to fetch again.
      this.locationsPromise = null
    }
  }

  _fetchLocations = async () => {
    try {

      const {data: {data: locations}} = await server.regions.index()

      await this.setState({locations})
    } catch (error) {
      apiErrorAlert(error)
    }
  }

  getEvents = async (_location = null) => {
    try {
      const [{data}, ..._rest] = await Promise.all([
        server.events.index(defaultEventSort),
        this.fetchLocations(),
      ])
      const eventsById = {}

      data.data.forEach((event) => {
        if (!event.promo_image_url) {
          event.promo_image_url = `${baseURL}/images/event-placeholder.png`
        }
        eventsById[event.id] = event
      })

      this.setState({
        lastUpdate: DateTime.local(),
        events: data.data,
        eventsById,
        paging: data.paging,
      })
    } catch (error) {
      apiErrorAlert(error)
    }
  }

  clearEvent = () => {
    this.setState({selectedEvent: {}})
  }

  getEvent = async (id) => {
    try {
      const {data} = await server.events.read({id})
      const ticketTypesById = {}

      if (!data.promo_image_url) {
        data.promo_image_url = `${baseURL}/images/event-placeholder.png`
      }

      data.ticket_types.forEach((ttype) => {
        ticketTypesById[ttype.id] = ttype
      })

      this.setState({
        selectedEvent: {...data},
        ticketTypesById,
      })
    } catch (error) {
      apiErrorAlert(error)
    }
  }

  changeLocation = (_index, {id}) => this.setState({selectedLocationId: id})

  // allEvents will refresh all events (ie: from the index page), whereas setting it to false will refresh the interested event
  toggleInterest = async (event, singleEvent = false) => {
    const {user_is_interested, id} = event

    try {
      if (user_is_interested) {
        // User already interested, so delete it.
        const _response = await server.events.interests.remove({event_id: id})
      } else {
        const _response = await server.events.interests.create({event_id: id})
      }
    } catch (error) {
      apiErrorAlert(error, 'There was a problem selecting this event.')
    } finally {
      this.getEvents()
      if (singleEvent) {
        this.getEvent(id)
      }
    }
  }

  async replaceTicketType(ticket_type) {
    const {ticketTypesById} = this.state

    ticketTypesById[ticket_type.id] = ticket_type
    await this.setState({ticketTypesById})
  }

}

export {
  EventsContainer,
}
