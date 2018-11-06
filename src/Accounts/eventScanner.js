import React from 'react';
import {Text, View, Image, TextInput, ScrollView, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import EventDetailsStyles from '../styles/event_details/eventDetailsStyles'

const styles = SharedStyles.createStyles()
const eventDetailsStyles = EventDetailsStyles.createStyles()


export default function EventScanner(props) {
  const {navigation: {navigate}} = props

  return (
    <View>
      <Image
        style={eventDetailsStyles.videoBkgd}
        source={require('../../assets/phone-scanner.png')}
      />

      <ScrollView>
        <View style={[styles.container, eventDetailsStyles.mainBody]}>
          <View style={eventDetailsStyles.mainBodyContent}>
            <View style={styles.flexRowSpaceBetween}>
              <Text numberOfLines={2} style={eventDetailsStyles.descriptionHeader}>All Guests</Text>
              <Text style={eventDetailsStyles.calendarMonth}>icon</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={eventDetailsStyles.backArrowWrapper}>
        <View style={eventDetailsStyles.backArrowCircleContainer}>
          <Icon
            style={eventDetailsStyles.backArrow}
            name="close"
            onPress={() => {
              navigate('ManageEvents')
            }}
          />
        </View>
      </View>

    </View>
  );
}
