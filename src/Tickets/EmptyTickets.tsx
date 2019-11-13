import React from 'react'
import { Image, Text, View } from 'react-native'
import TicketStyles from '../styles/tickets/ticketStyles'

interface Props {
  text: string
}

const emptyState = require('../../assets/icon-empty-state.png')
const ticketStyles = TicketStyles.createStyles()

const EmptyTickets = ({ text }: Props) => (
  <View style={ticketStyles.emptyStateContainer}>
    <Image style={ticketStyles.emptyStateIcon} source={emptyState} />
    <Text style={ticketStyles.emptyStateText}>{text}</Text>
  </View>
)

export default EmptyTickets
