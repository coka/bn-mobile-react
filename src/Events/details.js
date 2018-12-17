import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Text, Platform, View, Linking, TouchableHighlight} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import EventDetailsStyles from '../styles/event_details/eventDetailsStyles'
import {DateTime} from 'luxon'
import {map} from 'lodash'
import {shareEvent} from '../sharing'

/*  eslint-disable camelcase */

const styles = SharedStyles.createStyles()
const eventDetailsStyles = EventDetailsStyles.createStyles()
const interestedStylesForEvent = (user_is_interested) => (
  user_is_interested ? {
    button: eventDetailsStyles.buttonRoundedActive,
    icon: eventDetailsStyles.buttonRoundedActiveIcon,
    text: eventDetailsStyles.buttonRoundedActiveText,
  } : {
    button: eventDetailsStyles.buttonRounded,
    icon: eventDetailsStyles.buttonRoundedIcon,
    text: eventDetailsStyles.buttonRoundedText,
  }
)

function toSentence(arr) {
  return arr.slice(0, -2).join(', ') +
    (arr.slice(0, -2).length ? ', ' : '') +
    arr.slice(-2).join(arr.length === 2 ? ' and ' : ', and ');
}

export default class Details extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    onInterested: PropTypes.func.isRequired,
  }

  toggleInterest = () => {
    const {onInterested, event} = this.props

    // set 'true' for individual event
    onInterested(event, true)
  }

  get topLineInfo() {
    const {event: {top_line_info}} = this.props

    if (top_line_info) {
      return <Text style={eventDetailsStyles.descriptionSubHeader}>{top_line_info}</Text>
    }

    return null
  }

  get artistNames() {
    const {event: {artists}} = this.props

    if (artists.length === 0) {
      return null
    }

    return toSentence(map(artists, (eventArtist) => eventArtist.artist.name))
  }

  get ageLimit() {
    const {event: {age_limit}} = this.props

    if (age_limit) {
      return `You must be ${age_limit} to enter this event.`
    }

    return 'This event is for all ages.'
  }

  get youtube() {
    return null

    // return (
    //   <View>
    //     <View style={eventDetailsStyles.iconSectionHeaderContainer}>
    //       <Image
    //         style={eventDetailsStyles.iconYoutube}
    //         source={require('../../assets/icon-youtube.png')}
    //       />
    //       <Text style={eventDetailsStyles.iconSectionHeader}>YOUTUBE</Text>
    //     </View>

    //     <View style={eventDetailsStyles.youtubeVideoContainer}>
    //       <Image
    //         style={eventDetailsStyles.videoBkgd}
    //         source={require('../../assets/video-youtube-bkgd.png')}
    //       />
    //       <Image
    //         style={eventDetailsStyles.videoBkgd}
    //         source={require('../../assets/video-bkgd-overlay.png')}
    //       />
    //       <Icon style={eventDetailsStyles.iconPlayLink} name="play-circle-outline" />
    //     </View>
    //   </View>
    // )
  }

  get interested() {
    return null

    // return (
    //   <View style={eventDetailsStyles.eventDetailsContainer}>
    //     <View style={eventDetailsStyles.eventDetailsLeft}>
    //       <View style={eventDetailsStyles.avatarContainer}>
    //         <Image
    //           style={eventDetailsStyles.avatar}
    //           source={require('../../assets/avatar-male.png')}
    //         />
    //         <Image
    //           style={eventDetailsStyles.avatar}
    //           source={require('../../assets/avatar-female-2.png')}
    //         />
    //         <Image
    //           style={eventDetailsStyles.avatar}
    //           source={require('../../assets/avatar-male-2.png')}
    //         />
    //         <Image
    //           style={eventDetailsStyles.avatar}
    //           source={require('../../assets/avatar-female-3.png')}
    //         />
    //         <Image
    //           style={eventDetailsStyles.avatar}
    //           source={require('../../assets/avatar-female.png')}
    //         />
    //         <View style={eventDetailsStyles.attendeeContainer}>
    //           <Text style={eventDetailsStyles.attendeeNumber}>+{event.total_interest}</Text>
    //         </View>
    //       </View>
    //     </View>
    //   </View>
    // )
  }

  get instagram() {
    return null

    // return  (
    //   <View>
    //     <View style={eventDetailsStyles.iconSectionHeaderContainer}>
    //       <Image
    //         style={eventDetailsStyles.iconInstagram}
    //         source={require('../../assets/icon-instagram.png')}
    //       />
    //       <Text style={eventDetailsStyles.iconSectionHeader}>INSTAGRAM</Text>
    //     </View>

    //     <View style={imageGridStyles.imageGridContainer}>
    //       <Image
    //         style={imageGridStyles.image}
    //         source={require('../../assets/image-grid-1.png')}
    //       />
    //       <Image
    //         style={imageGridStyles.image}
    //         source={require('../../assets/image-grid-2.png')}
    //       />
    //       <Image
    //         style={imageGridStyles.image}
    //         source={require('../../assets/image-grid-3.png')}
    //       />
    //     </View>
    //     <View style={imageGridStyles.imageGridContainer}>
    //       <Image
    //         style={imageGridStyles.image}
    //         source={require('../../assets/image-grid-1.png')}
    //       />
    //       <Image
    //         style={imageGridStyles.image}
    //         source={require('../../assets/image-grid-2.png')}
    //       />
    //       <Image
    //         style={imageGridStyles.image}
    //         source={require('../../assets/image-grid-3.png')}
    //       />
    //     </View>
    //   </View>
    // )
  }

  get spotify() {
    return null

    // return (
    //   <View>
    //     <View style={eventDetailsStyles.iconSectionHeaderContainer}>
    //       <Image
    //         style={eventDetailsStyles.iconSpotify}
    //         source={require('../../assets/icon-spotify.png')}
    //       />
    //       <Text style={eventDetailsStyles.iconSectionHeader}>SPOTIFY</Text>
    //     </View>

    //     <View style={eventDetailsStyles.imagePlaceholderContainer}>
    //       <Image
    //         style={eventDetailsStyles.imagePlaceholder}
    //         source={require('../../assets/spotify-placeholder.png')}
    //       />
    //       <View style={eventDetailsStyles.sliderArrowContainer}>
    //         <Icon style={eventDetailsStyles.slideShowIconLinkLeft} name="keyboard-arrow-left" />
    //         <Icon style={eventDetailsStyles.slideShowIconLinkRight} name="keyboard-arrow-right" />
    //       </View>
    //     </View>

    //   </View>
    // )
  }

  onPressShare = () => shareEvent(this.props.event)

  openVenueDirections = () => {
    const {event} = this.props
    const {venue} = event
    const daddr = encodeURIComponent(`${venue.address} ${venue.postal_code}, ${venue.city}, ${venue.country}`);

    if (Platform.OS === 'ios') {
      Linking.openURL(`http://maps.apple.com/?daddr=${daddr}`);
    } else {
      Linking.openURL(`http://maps.google.com/?daddr=${daddr}`);
    }
  }

  render() {
    const {event} = this.props
    const {venue} = event
    const eventStart = DateTime.fromISO(event.event_start)
    const doorTime = DateTime.fromISO(event.door_time)
    const interestedStyles = interestedStylesForEvent(event.user_is_interested)

    return (
      <View style={[styles.container, eventDetailsStyles.mainBody]}>
        <View style={eventDetailsStyles.mainBodyContent}>
          {this.topLineInfo}
          <View style={styles.flexRowSpaceBetween}>
            <View>
              <Text numberOfLines={2} style={eventDetailsStyles.descriptionHeader}>{event.name}</Text>
            </View>
            <View style={eventDetailsStyles.calendarWrapper}>
              <Text style={eventDetailsStyles.calendarMonth}>{eventStart.toFormat('LLL')}</Text>
              <Text style={eventDetailsStyles.calendarDate}>{eventStart.toFormat('dd')}</Text>
            </View>
          </View>

          <View style={[styles.flexRowSpaceBetween, styles.paddingTop]}>
            <TouchableHighlight style={[interestedStyles.button, styles.marginRightTiny]} onPress={this.toggleInterest}>
              <View style={styles.flexRowCenter}>
                <Icon style={interestedStyles.icon} name="star" />
                <Text style={interestedStyles.text}>I&apos;m Interested</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={[eventDetailsStyles.buttonRounded, styles.marginLeftTiny]} onPress={this.onPressShare}>
              <View style={styles.flexRowCenter}>
                <Icon style={eventDetailsStyles.buttonRoundedIcon} name="reply" />
                <Text style={eventDetailsStyles.buttonRoundedText}>Share Event</Text>
              </View>
            </TouchableHighlight>
          </View>

          {this.interested}

          <View style={eventDetailsStyles.eventDescriptionContainer}>

            <View style={eventDetailsStyles.eventDescriptionHeaderWrapper}>
              <Icon style={eventDetailsStyles.iconEventDescription} name="access-time" />
              <Text style={eventDetailsStyles.sectionHeader}>TIME AND LOCATION</Text>
            </View>

            <TouchableHighlight onPress={this.openVenueDirections} underlayColor="rgba(0, 0, 0, 0)">
              <Text style={eventDetailsStyles.linkText}>{venue.name}</Text>
            </TouchableHighlight>
            <Text style={eventDetailsStyles.bodyText}>
              {venue.address}, {venue.city}, {venue.state} {venue.postal_code}, {venue.country}
            </Text>
            <Text style={[eventDetailsStyles.bodyText, styles.noPaddingBottom]}>
              {eventStart.toFormat('DDDD')}
            </Text>
            <Text style={eventDetailsStyles.bodyText}>
              Doors {doorTime.toFormat('t ZZZZ')} - Show {eventStart.toFormat('t ZZZZ')}
            </Text>

            <View style={eventDetailsStyles.eventDescriptionHeaderWrapper}>
              <Icon style={eventDetailsStyles.iconEventDescription} name="person-outline" />
              <Text style={eventDetailsStyles.sectionHeader}>PERFORMING ARTISTS</Text>
            </View>
            <Text style={eventDetailsStyles.bodyText}>
              {this.artistNames}
            </Text>

            <View style={eventDetailsStyles.eventDescriptionHeaderWrapper}>
              <Icon style={eventDetailsStyles.iconEventDescription} name="error-outline" />
              <Text style={eventDetailsStyles.sectionHeader}>AGE RESTRICTIONS</Text>
            </View>
            <Text style={eventDetailsStyles.bodyText}>
              {this.ageLimit}
            </Text>

            <View style={eventDetailsStyles.eventDescriptionHeaderWrapper}>
              <Icon style={eventDetailsStyles.iconEventDescription} name="music-note" />
              <Text style={eventDetailsStyles.sectionHeader}>EVENT DESCRIPTION</Text>
            </View>
            <Text style={eventDetailsStyles.bodyText}>
              {event.additional_info}
            </Text>

          </View>

          {this.youtube}
          {this.instagram}
          {this.spotify}

        </View>
        <View style={eventDetailsStyles.spacerFooter} />
      </View>

    )
  }
}
