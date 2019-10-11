/**
 * TODO:
 *
 * I had grand plans of making this persist to AsyncStorage so it would survive restarts,
 * but to do that properly we should manage the size so we don't keep old event tix around forever.
 *
 * Which would be considerably trickier to do in terms of data structures and algorithms
 * to make use of the very limited AsyncStorage API.
 *
 * We should still do that at some point, but for now, we'll just keep all of this in memory.
 */

class TicketScanLog {
  _redeemedAtById = {}

  logRedeemedAt({ id }) {
    this._redeemedAtById[id] = new Date()
  }

  getRedeemedAt({ id }) {
    return this._redeemedAtById[id] || null
  }
}

const ticketScanLog = new TicketScanLog()

export default ticketScanLog
