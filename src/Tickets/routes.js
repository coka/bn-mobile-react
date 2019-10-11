import MyTickets from './index'
import ShowEventTickets from './showEventTickets'
import TransferTickets from './transferTickets'

export const MAIN_ROUTES = {
  MyTicketList: MyTickets,
}

const TicketShowRoute = {
  screen: ShowEventTickets,
  navigationOptions: ({ navigation }) => ({
    eventId: navigation.state.params.eventId,
  }),
}

export const MODAL_ROUTES = {
  EventTickets: TicketShowRoute,
  TransferTickets,
}
