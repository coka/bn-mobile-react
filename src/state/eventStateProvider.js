import { Container } from 'unstated'
import { server, apiErrorAlert, defaultEventSort } from '../constants/Server'
import { baseURL } from '../constants/config'
import { DateTime } from 'luxon'
import { map } from 'lodash'
import { Image } from 'react-native'
import { optimizeCloudinaryImage } from '../cloudinary'
const LOCATIONS_FETCH_MIN_MINUTES = 15

/* eslint-disable complexity,space-before-function-paren,camelcase */

function ticketFilter({ status, ticket_pricing }) {
  switch (status) {
    case 'SoldOut':
      return true
    case 'Published':
      return !!ticket_pricing
    default:
      return false
  }
}

function ticketComparator({ ticket_pricing: a }, { ticket_pricing: b }) {
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
    super(props)

    this.state = {
      total: null,
      page: 0,
      limit: 10,
      loading: false,
      query: '',
      suggestedNames: [],
      events: [],
      eventsById: {},
      ticketTypesById: {},
      paging: {},
      lastUpdate: null,
      locations: [],
      selectedLocationId: null,
      selectedEvent: {},
    }
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

  get eventTickets() {
    return map(this.ticketTypesById, (ticket, _id) => ticket)
  }

  get selectedEvent() {
    return this.state.selectedEvent
  }

  get ticketsToDisplay() {
    const { ticketTypesById } = this.state

    ticketTypes = map(ticketTypesById, (ticket, _id) => ticket)

    return ticketTypes ?
      ticketTypes.filter(ticketFilter).sort(ticketComparator) :
      []
  }

  get hasNextPage() {
    const { total, page, limit } = this.state

    if (total && total > 0) {
      return total - (page + 1) * limit > 0
    }

    return false
  }

  setQuery = async (query) => {
    this.setState({ query })
  }

  locationsPromise = null
  locationsLastFetched = null

  fetchLocations = async (...args) => {
    // Already fetching. Wait for existing promise to finish.
    if (this.locationsPromise !== null) {
      return await this.locationsPromise
    }
    // Don't fetch more often than is sane.
    if (
      this.locationsLastFetched &&
      this.locationsLastFetched.plus({ minutes: LOCATIONS_FETCH_MIN_MINUTES }) <
      DateTime.local()
    ) {
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
    return []
    // try {
    //   const {
    //     data: { data: locations },
    //   } = await server.regions.index()

    //   await this.setState({ locations })
    // } catch (error) {
    //   apiErrorAlert(error)
    // }
  }

  _cacheResourcesAsync = async (eventImagePrefetch) => {
    Promise.all(eventImagePrefetch)
  }

  _fetchEvents = async (options) => {
    return Promise.all([server.events.index(options), this.fetchLocations()])
  }

  buildFetchEventsOptions(incomingOptions) {
    const { limit } = this.state

    const options = { ...defaultEventSort, limit, page: incomingOptions.page }

    if (incomingOptions.query && incomingOptions.query.length >= 3) {
      options.query = incomingOptions.query
      options.status = 'Published'
    }

    if (incomingOptions.selectedLocationId) {
      options.region_id = incomingOptions.selectedLocationId
    }

    return options
  }

  getEvents = async (options = {}) => {
    const { events, eventsById } = this.state

    let query = this.state.query

    if ('query' in options) {
      query = options.query
    }

    let selectedLocationId = this.state.selectedLocationId

    if ('selectedLocationId' in options) {
      selectedLocationId = options.selectedLocationId
    }

    let page = this.state.page

    if ('page' in options) {
      page = options.page
    }

    const queryOptions = this.buildFetchEventsOptions({
      query,
      selectedLocationId,
      page,
    })

    try {
      this.setState({ loading: true })

      const [{ data }, ..._rest] = await this._fetchEvents(queryOptions)
      const imagePrefetch = []
      const eventsByIdObj = options.replaceEvents ? {} : eventsById

      // process event images
      data.data.forEach((event) => {
        if (!event.promo_image_url) {
          event.promo_image_url = `${baseURL}/images/event-placeholder.png`
        }
        // Add images to the cache
        imagePrefetch.push(
          Image.prefetch(optimizeCloudinaryImage(event.promo_image_url))
        )

        eventsByIdObj[event.id] = event
      })
      this._cacheResourcesAsync(imagePrefetch)

      this.setState({
        lastUpdate: DateTime.local(),
        events: options.replaceEvents ? data.data : events.concat(data.data),
        eventsById: eventsByIdObj,
        paging: data.paging,
        total: data.paging.total,
        limit: data.paging.limit,
        page: data.paging.page,
        selectedLocationId,
        query,
      })
    } catch (error) {
      setTimeout(() => {
        apiErrorAlert(error)
      }, 600)
    } finally {
      this.setState({ loading: false })
    }
  }

  refreshEvents = async (onFinish) => {
    await this.setState({ page: 0 })
    await this.getEvents({ replaceEvents: true })
    onFinish()
  }

  fetchNextPage = async () => {
    await this.setState((state) => {
      return { page: state.page + 1 }
    })

    this.getEvents()
  }

  clearEvent = () => {
    this.setState({ selectedEvent: {} })
  }

  getEvent = async (id) => {
    try {
      const { data } = await server.events.read({ id })
      const ticketTypesById = {}

      if (!data.promo_image_url) {
        data.promo_image_url = `${baseURL}/images/event-placeholder.png`
      }

      data.ticket_types.forEach((ttype) => {
        ticketTypesById[ttype.id] = ttype
      })

      this.setState({
        selectedEvent: { ...data },
        ticketTypesById,
      })
    } catch (error) {
      apiErrorAlert(error)
    }
  }

  changeLocation = (_index, { id }) => this.setState({ selectedLocationId: id })

  // allEvents will refresh all events (ie: from the index page), whereas setting it to false will refresh the interested event
  toggleInterest = async (event, singleEvent = false) => {
    const { user_is_interested, id } = event
    const { remove, create } = server.events.interests

    try {
      this.setState({ loading: true })
      if (user_is_interested) {
        await remove({ event_id: id })
      } else {
        await create({ event_id: id })
      }
    } catch (error) {
      apiErrorAlert(error, 'There was a problem selecting this event.')
    } finally {
      this.getEvents({ replaceEvents: true })
      if (singleEvent) {
        this.getEvent(id)
      }
      this.setState({ loading: false })
    }
  }

  async replaceTicketType(ticket_type) {
    const { ticketTypesById } = this.state

    ticketTypesById[ticket_type.id] = ticket_type
    await this.setState({ ticketTypesById })
  }


  clearEventState = async () => {
    this.setState({
      total: null,
      page: 0,
      limit: 10,
      loading: false,
      query: '',
      suggestedNames: [],
      events: [],
      eventsById: {},
      ticketTypesById: {},
      paging: {},
      lastUpdate: null,
      locations: [],
      selectedLocationId: null,
      selectedEvent: {},
    })
  }
}

export { EventsContainer }
