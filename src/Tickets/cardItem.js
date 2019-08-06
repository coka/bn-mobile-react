import React from 'react'
import { PropTypes } from 'prop-types'
import { View, Text } from 'react-native'

import CircleCheckBox from 'react-native-circle-checkbox'
import SharedStyles, { primaryColor } from '../styles/shared/sharedStyles'
import TicketStyles from '../styles/tickets/ticketStyles'
import TicketTransferStyles from '../styles/tickets/ticketTransferStyles'

const styles = SharedStyles.createStyles()
const ticketStyles = TicketStyles.createStyles()
const ticketTransferStyles = TicketTransferStyles.createStyles()

const Card = ({ children }) => (
  <View style={styles.flexRowCenter}>
    <View style={ticketTransferStyles.cardContainer}>{children}</View>
  </View>
)

const CardItem = ({ id, name, checkboxes, toggleCheck }) => (
  <Card key={id}>
    <View style={styles.flexRowFlexStart}>
      <CircleCheckBox
        checked={checkboxes[id]}
        onToggle={toggleCheck(id)}
        innerColor={primaryColor}
        outerColor={primaryColor}
        innerSize={15}
        outerSize={29}
        styleCheckboxContainer={styles.marginRight}
      />
      <View>
        <Text style={ticketStyles.ticketHolderHeader}>
          {name}
        </Text>
        <Text style={ticketStyles.ticketHolderSubheader}>
          #{id.slice(-8)}
        </Text>
      </View>
    </View>
  </Card>
)

CardItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checkboxes: PropTypes.isRequired,
}

export default CardItem;