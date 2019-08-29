import React, { Component } from 'react'
import { View, BackHandler } from 'react-native'
import GuestList from './guest-list-checkin'

export default class GuestListScreen extends Component {

  state = {
    selectedGuest: null,
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
  }

  handleBackPress = () => {
    const { selectedGuest } = this.state;
    if (selectedGuest) {
      this.setState({ selectedGuest: null });
      return true;
    }

    return false;
  }

  selectGuest = (selectedGuest) => {
    this.setState({ selectedGuest });
  }

  render() {
    const {
      state: managerState,
      searchGuestList,
      updateGuestStatus,
    } = this.props.screenProps.eventManager

    const { selectedGuest } = this.state;

    return (
      <View>
        <GuestList
          {...managerState}
          searchGuestList={searchGuestList}
          updateGuestStatus={updateGuestStatus}
          selectGuest={this.selectGuest}
          selectedGuest={selectedGuest}
        />
      </View>
    )
  }
}
