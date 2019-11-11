import { Container } from 'unstated'
import mockTransferActivityData from '../mockTransferActivityData'

type State = Array<{
  event: any
  ticket_activity_items: any
}>

class TicketTransfersContainer extends Container<State> {
  state = mockTransferActivityData.data
}

export default TicketTransfersContainer
