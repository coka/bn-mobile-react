import React, { Component } from 'react'
import { Animated } from 'react-native'
import Ticket, { Props as TicketProps } from './TicketComponent'

export interface Props extends TicketProps {
  index: any
  requestScrollToTicket: any
  springValue: any
}

class AnimatedTicket extends Component<Props> {
  componentDidMount() {
    const { index, requestScrollToTicket } = this.props
    requestScrollToTicket(index)
  }

  render() {
    const {
      activeTab,
      navigate,
      setPurchasedTicket,
      springValue,
      ticket,
    } = this.props

    return (
      <Animated.View style={{ transform: [{ scale: springValue }] }}>
        <Ticket
          navigate={navigate}
          ticket={ticket}
          activeTab={activeTab}
          setPurchasedTicket={setPurchasedTicket}
        />
      </Animated.View>
    )
  }
}

export default AnimatedTicket
