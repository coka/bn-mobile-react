import {Container} from 'unstated'
import {server, apiErrorAlert} from '../constants/Server'

class OrderHistoryContainer extends Container {
  constructor(props = {}) {
    super(props)

    this.state = {
      isFetching: false,
      orders: [],
    }
  }

  fetchOrderHistoryForUser = async() => {
    try {
      this.setState({isFetching: true})
      const response = await server.orders.index()
      const {data, _paging} = response.data // @TODO: pagination

      this.setState({orders: data, isFetching: false})
    } catch (error) {
      this.setState({isFetching: false})
      apiErrorAlert(error, 'Loading order history failed.')
    }
  }

  get orders() {
    return this.state.orders
  }

  get isFetching() {
    return this.state.isFetching
  }
}

export {OrderHistoryContainer}
