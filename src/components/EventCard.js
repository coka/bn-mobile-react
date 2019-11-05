import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Image } from 'react-native-expo-image-cache'
import { optimizeCloudinaryImage } from '../cloudinary'
import { toDollars } from '../constants/money'
import { colors, fonts } from '../styles/shared/sharedStyles'
import { eventDateTimes } from '../time'
import Star from './Star'

// TODO: Look into performing these transformations in the function which
//       recieves the API data.

const getStartTime = (event) =>
  eventDateTimes(event.localized_times).event_start

const getPriceString = (event) => {
  const { min_ticket_price, max_ticket_price } = event
  let price
  if (min_ticket_price) {
    price = `$${toDollars(event.min_ticket_price, 0)}`
    if (max_ticket_price > min_ticket_price) {
      price += '+'
    }
  }
  return price
}

const EventCard = ({ event, favorite, goToEvent, isFirst }) => {
  const {
    user_is_interested: interested,
    venue: { name, city, state },
  } = event
  const start = getStartTime(event)
  const price = getPriceString(event)
  return (
    <View style={[styles.container, isFirst ? styles.firstContainer : {}]}>
      <TouchableHighlight
        style={{ borderRadius: 5 }}
        onPress={goToEvent}
        underlayColor="transparent"
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            uri={optimizeCloudinaryImage(event.promo_image_url)}
            defaultSource={require('../../assets/event-placeholder.png')}
          />
          <View style={styles.starContainer}>
            <Star active={interested} onPress={() => favorite(event, true)} />
          </View>
          <View
            style={[
              styles.infoContainer,
              price ? {} : styles.infoContainerWithoutPrice,
            ]}
          >
            <View style={styles.dateContainer}>
              <Emphasis>{start.toFormat('MMMM d')}</Emphasis>
              <View style={styles.bullet} />
              <Information>
                {start.toFormat('EEE, h:mm') +
                  start.toFormat('a').toLowerCase()}
              </Information>
            </View>
            {price && (
              <View style={styles.priceContainer}>
                <Emphasis>{price}</Emphasis>
              </View>
            )}
          </View>
          <Headline>{event.name}</Headline>
          <View style={styles.venueContainer}>
            <Information>
              @ {name}, {city}, {state}
            </Information>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  bullet: {
    backgroundColor: '#c4c8d2',
    borderRadius: 1.5,
    height: 3,
    marginHorizontal: 6,
    width: 3,
  },
  container: {
    marginTop: 32,
  },
  dateContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  firstContainer: {
    marginTop: 0,
  },
  image: {
    borderRadius: 5,
    height: 188,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  infoContainerWithoutPrice: {
    marginBottom: 3.5,
  },
  priceContainer: {
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    alignItems: 'center',
    backgroundColor: '#fff4fb',
    height: 26,
    justifyContent: 'center',
    width: 54,
  },
  starContainer: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  venueContainer: {
    marginTop: 6,
  },
})

const Emphasis = ({ children }) => (
  <Text style={textStyles.emphasis}>{children}</Text>
)

const Headline = ({ children }) => (
  <Text style={textStyles.headline}>{children}</Text>
)

const Information = ({ children }) => (
  <Text style={textStyles.information}>{children}</Text>
)

const textStyles = StyleSheet.create({
  emphasis: {
    color: colors.brand,
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
  headline: {
    color: '#1d1e1f',
    fontFamily: fonts.semiBold,
    fontSize: 19,
    lineHeight: 21,
  },
  information: {
    color: '#9da3b4',
    fontFamily: fonts.medium,
    fontSize: 16,
  },
})

export default EventCard
