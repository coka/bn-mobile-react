import { Image } from 'expo'
import { Asset } from 'expo-asset'

const IMAGES = [
  require('./back.png'),
  require('./logo.png'),
  require('./facebook.png'),
  require('./x.png'),
  require('./account-placeholder-bkgd.png'),
  require('./big-neon-logo.png'),
  require('./event-img-overlay.png'),
  require('./emoji-loader.png'),
  require('./heart-large.png'),
  require('./heart-small.png'),
  require('./heart-white.png'),
  require('./icon-account-active.png'),
  require('./icon-account.png'),
  require('./icon-empty-state.png'),
  require('./icon-explore-active.png'),
  require('./icon-explore.png'),
  require('./icon-ticket.png'),
  require('./icon-ticket-active.png'),
  require('./icon-wallet.png'),
  require('./login-bkgd.png'),
  require('./qr-code-placeholder.png'),
  require('./qr-code-small.png'),
  require('./event-placeholder.png'),
  require('./star-active.png'),
  require('./star-inactive.png'),
  require('./transfer.png'),
  require('./transfer-dashes.png'),
  require('./transfer-green.png'),
  require('./transfer-red.png'),
]

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === 'string') {
      return Image.prefetch(image)
    } else {
      return Asset.fromModule(image).downloadAsync()
    }
  })
}

export async function loadImages() {
  return await cacheImages(IMAGES)
}
