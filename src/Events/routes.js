import EventsIndex from './index'
import EventsShow from './show'
import EventsChangeLocation from './location'
import EventsSearch from './search'
import GetTickets from './tickets'
import Checkout from './checkout'
import PaymentTypes from './payments'

const EventsIndexRoute = {
  screen: EventsIndex,
  navigationOptions: {
    title: 'Home',
    header: null,
  },
}

const EventsShowRoute = {
  screen: EventsShow,
  navigationOptions: ({navigation}) => ({
    eventId: navigation.state.params.eventId,
    event: navigation.state.params.event,
  }),
}

const EventsChangeLocationRoute = {
  screen: EventsChangeLocation,
  navigationOptions: {
    title: 'Change Location',
  },
}

const EventsSearchRoute = {
  screen: EventsSearch,
  navigationOptions: {
    title: 'Search for Events',
  },
}

const GetTicketsRoute = {
  screen: GetTickets,
  navigationOptions: {
    title: 'Get Tickets',
  },
}

const CheckoutRoute = {
  screen: Checkout,
  navigationOptions: {
    title: 'Checkout',
  },
}

const PaymentTypesRoute = {
  screen: PaymentTypes,
  navigationOptions: {
    title: 'PaymentTypes',
  },
}

const ROUTES = {
  Home: EventsIndexRoute,
  EventsIndex: EventsIndexRoute,
  EventsShow: EventsShowRoute,
  EventsChangeLocation: EventsChangeLocationRoute,
  EventsSearch: EventsSearchRoute,
  GetTickets: GetTicketsRoute,
  Checkout: CheckoutRoute,
  PaymentTypes: PaymentTypesRoute,
}

export default ROUTES
