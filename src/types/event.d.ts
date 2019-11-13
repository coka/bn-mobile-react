interface Event {
  formattedDate: string
  formattedDoors: string
  formattedStart: string
  localized_times: any
  name: string
  promo_image_url: string
  venue: Venue
}

interface Venue {
  address: string
  city: string
  country: string
  name: string
  postal_code: string
}
