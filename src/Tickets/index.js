import { PropTypes } from 'prop-types'
import React, { Component } from 'react'
import { Animated, Image, Text, View } from 'react-native'
import { NavigationEvents } from 'react-navigation'
import SharedStyles from '../styles/shared/sharedStyles'
import TicketsView from './TicketsView'

const styles = SharedStyles.createStyles()

const EMPTY_TEXT_FOR_ACTIVE_TAB = {
  upcoming:
    'Looks like you don’t have any upcoming events! Why not tap Explore and have a look?',
  past:
    'Looks like you haven’t attended any events yet! Why not tap Explore and find your first?',
  transfer:
    'Looks like you haven’t transfered any tickets yet. Know anyone that wants to go?',
}

export default class MyTickets extends Component {
  constructor(props) {
    super(props)
    this.props.screenProps.auth.identify()
    this.springValue = new Animated.Value(0.3)
  }

  static navigationOptions = {
    header: null,
  }

  get activeTab() {
    return this.props.navigation.getParam('activeTab', 'upcoming')
  }

  set activeTab(activeTab) {
    this.props.navigation.setParams({ activeTab })
  }

  spring() {
    this.springValue.setValue(0.3)
    Animated.spring(this.springValue, {
      toValue: 1,
      friction: 1,
      tension: 1,
    }).start()
  }

  tabStyle(viewType) {
    return viewType === this.activeTab
      ? styles.subnavHeaderActive
      : styles.subnavHeader
  }

  tabWrapperStyle(viewType) {
    return viewType === this.activeTab ? styles.activeWrapper : null
  }

  get ticketsForActiveView() {
    return this.props.screenProps.store.state.tickets[this.activeTab] || []
  }

  get emptyText() {
    return EMPTY_TEXT_FOR_ACTIVE_TAB[this.activeTab]
  }

  refreshTickets = async () => {
    await this.props.screenProps.store.userTickets()
    this.spring()
  }

  changeTab = (tab) => {
    this.props.screenProps.store.setPurchasedTicket(null)
    this.activeTab = tab
  }

  render() {
    const {
      navigation: { navigate },
      screenProps: {
        store: {
          setPurchasedTicket,
          state: { purchasedTicket },
        },
      },
    } = this.props

    return (
      <View style={styles.containerDark}>
        <NavigationEvents
          onWillFocus={this.refreshTickets}
          onDidBlur={() => setPurchasedTicket(null)}
        />
        <View style={styles.headerContainer}>
          <View style={[styles.sectionHeaderContainer, styles.flexRowCenter]}>
            <Image
              style={[styles.iconImage, styles.marginBottomSmall]}
              source={require('../../assets/heart-large.png')}
            />
          </View>
        </View>
        <View style={styles.subnavContainer}>
          <View style={this.tabWrapperStyle('upcoming')}>
            <Text
              style={this.tabStyle('upcoming')}
              onPress={() => this.changeTab('upcoming')}
            >
              UPCOMING
            </Text>
          </View>
          <View style={this.tabWrapperStyle('past')}>
            <Text
              style={this.tabStyle('past')}
              onPress={() => this.changeTab('past')}
            >
              PAST
            </Text>
          </View>
          <View style={this.tabWrapperStyle('transfer')}>
            <Text
              style={this.tabStyle('transfer')}
              onPress={() => this.changeTab('transfer')}
            >
              TRANSFERS
            </Text>
          </View>
        </View>
        <TicketsView
          style={styles.paddingHorizontal}
          showsVerticalScrollIndicator={false}
          emptyText={this.emptyText}
          navigate={navigate}
          tickets={this.ticketsForActiveView}
          springValue={this.springValue}
          purchasedTicket={purchasedTicket}
          activeTab={this.activeTab}
          setPurchasedTicket={setPurchasedTicket}
        />
      </View>
    )
  }
}

MyTickets.propTypes = {
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
}
