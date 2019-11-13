import { Linking, Platform } from 'react-native'

export const openVenueDirections = (venue) => {
  const encodedAddress = encodeURIComponent(
    `${venue.address} ${venue.postal_code}, ${venue.city}, ${venue.country}`
  )
  const mapProvider = Platform.OS === 'ios' ? 'apple' : 'google'
  Linking.openURL(`http://maps.${mapProvider}.com/?daddr=${encodedAddress}`)
}
