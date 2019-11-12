import { Container } from 'unstated'
import { apiErrorAlert, server } from '../constants/Server'
import { eventDateTimes } from '../time'

interface State {
  // because Unstated won't allow states which are arrays at the root
  data: Array<{
    event: any
    ticket_activity_items: any
  }>
}

class TicketTransfersContainer extends Container<State> {
  state = { data: [] }

  fetchTransfers = async () => {
    const response = await server.transfers.activity()
    this.setState(transformTransferActivityData({ data: response.data.data }))
  }

  cancelTransfer = async (transferId: string) => {
    try {
      await server.transfers.cancel({ id: transferId })
    } catch (error) {
      apiErrorAlert(error, 'Failed to transfer ticket.')
    }
  }
}

const transformTransferActivityData = (state: State): State => {
  state.data.forEach(({ event }) => {
    const { event_start, door_time } = eventDateTimes(event.localized_times)

    event.formattedDate = event_start.toFormat('EEE, MMMM d')
    event.formattedDoors = door_time.toFormat('t')
    event.formattedStart = event_start.toFormat('t')
  })

  return state
}

export default TicketTransfersContainer
