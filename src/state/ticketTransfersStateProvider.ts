import { Container } from 'unstated'
import { apiErrorAlert, server } from '../constants/Server'
import { eventDateTimes } from '../time'

interface State {
  data: Array<Transfer>
  isCancelling: boolean
  shouldRefresh: boolean
}

class TicketTransfersContainer extends Container<State> {
  state = {
    data: [],
    isCancelling: false,
    shouldRefresh: false,
  }

  fetchTransfers = async () => {
    const response = await server.transfers.activity()
    this.setState({
      data: transformTransferActivityData(response.data.data),
      shouldRefresh: false,
    })
  }

  cancelTransfer = async (transferId: string, onCompleted: () => void) => {
    try {
      await this.setState({ isCancelling: true })
      await server.transfers.cancel({ id: transferId })
      await this.setState({ isCancelling: false, shouldRefresh: true })
      onCompleted()
    } catch (error) {
      await this.setState({ isCancelling: false })
      apiErrorAlert(error, 'Failed to transfer ticket.')
    }
  }
}

const transformTransferActivityData = (
  data: Array<Transfer>
): Array<Transfer> => {
  data.forEach(({ event }) => {
    const { event_start, door_time } = eventDateTimes(event.localized_times)

    event.formattedDate = event_start.toFormat('EEE, MMMM d')
    event.formattedDoors = door_time.toFormat('t')
    event.formattedStart = event_start.toFormat('t')
  })

  return data
}

export default TicketTransfersContainer
