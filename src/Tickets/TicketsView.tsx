import { some } from 'lodash'
import React, { Component } from 'react'
import { FlatList, FlatListProps } from 'react-native'
import AnimatedTicket, { Props as AnimatedTicketProps } from './AnimatedTicket'
import EmptyTickets from './EmptyTickets'
import TicketComponent from './TicketComponent'

interface Props extends AnimatedTicketProps, FlatListProps<any> {
  emptyText: any
  purchasedTicket: any
  tickets: any
}

// The height of one ticket. Used for determining scroll position
const TICKET_HEIGHT = 265

class TicketsView extends Component<Props> {
  animatedTicketIndex = null
  scrolled = false

  componentDidMount() {
    // Capturing if we scrolled to a ticket
    this.animatedTicketIndex = null
    this.scrolled = false
  }

  requestScrollToTicket = (index) => {
    this.animatedTicketIndex = index
    this.scrolled = false
  }

  maybeScrollToTicket(ref) {
    if (
      ref != null &&
      this.scrolled === false &&
      this.animatedTicketIndex !== null
    ) {
      ref.scrollToIndex({
        animated: true,
        index: this.animatedTicketIndex,
      })

      this.scrolled = true
    }
  }

  render() {
    const {
      activeTab,
      emptyText,
      tickets,
      navigate,
      springValue,
      purchasedTicket,
      setPurchasedTicket,
    } = this.props

    if (!tickets.length) {
      return <EmptyTickets text={emptyText} />
    }

    return (
      <FlatList
        {...this.props}
        ref={(ref) => {
          this.maybeScrollToTicket(ref)
        }}
        keyExtractor={(item, _) => item.event.id}
        getItemLayout={(_data, index) => ({
          length: TICKET_HEIGHT,
          offset: TICKET_HEIGHT * index,
          index,
        })}
        data={tickets}
        renderItem={({ item, index }) => {
          return some(
            item.tickets,
            ({ order_id }) => order_id === purchasedTicket
          ) ? (
            <AnimatedTicket
              navigate={navigate}
              ticket={item}
              activeTab={activeTab}
              springValue={springValue}
              setPurchasedTicket={setPurchasedTicket}
              requestScrollToTicket={this.requestScrollToTicket}
              index={index}
            />
          ) : (
            <TicketComponent
              navigate={navigate}
              activeTab={activeTab}
              ticket={item}
              setPurchasedTicket={setPurchasedTicket}
            />
          )
        }}
      />
    )
  }
}

export default TicketsView
