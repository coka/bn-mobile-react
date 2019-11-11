interface Event {
  formattedDate: string
  formattedStart: string
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
