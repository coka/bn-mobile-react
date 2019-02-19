import React from 'react';
import {createBottomTabNavigator} from 'react-navigation'
import {Image} from 'react-native';
import NavigationStyles from '../styles/shared/navigationStyles'
import EventStack from './eventStack'
import TicketStack from './ticketStack'
import AccountsStack from './accountStack'

const navigationStyles = NavigationStyles.createStyles()

/* eslint-disable react/display-name, react/prop-types */
export default createBottomTabNavigator(
  {
    Explore: {
      screen: EventStack,
      navigationOptions: ({_navigation}) => ({
        tabBarIcon: ({focused}) => {
          const imageName = focused ? require('../../assets/icon-explore-active.png') : require('../../assets/icon-explore.png')

          return <Image style={navigationStyles.tabBarIconExplore} source={imageName} />
        },
        showIcon: true,
      }),
    },
    MyTickets: {
      screen: TicketStack,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          const imageName = focused ? require('../../assets/icon-ticket-active.png') : require('../../assets/icon-ticket.png')

          return <Image style={navigationStyles.tabBarIconTicket} source={imageName} />
        },
        showIcon: true,
      },
    },
    Account: {
      screen: AccountsStack,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          const imageName = focused ? require('../../assets/icon-account-active.png') : require('../../assets/icon-account.png')

          return <Image style={navigationStyles.tabBarIconAccount} source={imageName} />
        },
        showIcon: true,
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#FF20B1',
      inactiveTintColor: 'black',
      labelStyle: {
        fontFamily: 'tt_commons_regular',
        fontSize: 13,
      },
      style: {
        backgroundColor: 'white',
        borderWidth: 0,
        borderTopColor: '#DCDCDC',
        height: 50,
        paddingVertical: 4,
      },
    },
  },
)
