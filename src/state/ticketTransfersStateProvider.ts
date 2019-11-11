import { Container } from 'unstated'
import mockTransferActivityData from '../mockTransferActivityData'
import { eventDateTimes } from '../time'

type State = Array<{
  event: any
  ticket_activity_items: any
}>

class TicketTransfersContainer extends Container<State> {
  state = transformTransferActivityData(mockTransferActivityData.data)
}

const transformTransferActivityData = (data: State): State => {
  data.forEach(({ event }) => {
    const { event_start, door_time } = eventDateTimes(event.localized_times)

    event.formattedDate = event_start.toFormat('EEE, MMMM d')
    event.formattedDoors = door_time.toFormat('t')
    event.formattedStart = event_start.toFormat('t')
  })

  return data
}

export default TicketTransfersContainer
