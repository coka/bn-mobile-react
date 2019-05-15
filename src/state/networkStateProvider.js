import {Container} from 'unstated'
import {NetInfo} from 'react-native'

class NetworkContainer extends Container {
  constructor(props = {}) {
    super(props)

    this.state = {
      isConnected: true,
    }

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange
    )

    NetInfo.isConnected.fetch().then((isConnected) => {
      this.setState({isConnected})
    })
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({isConnected})
  }
}

export {NetworkContainer}
