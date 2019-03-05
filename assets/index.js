import {Asset, Image} from 'expo';

const IMAGES = [
  require('./account-placeholder-bkgd.png'),
  require('./big-neon-logo.png'),
  require('./event-img-overlay.png'),
  require('./emoji-loader.png'),
  require('./heart-large.png'),
  require('./heart-small.png'),
  require('./heart-white.png'),
  require('./Icon-1024.png'),
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
  require('./qr-code-small.png')
]

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}


export async function loadImages() {
  return await cacheImages(IMAGES);
}
