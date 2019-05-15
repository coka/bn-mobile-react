import React from 'react'
import {
  View,
  Modal as NativeModal,
  ActivityIndicator,
  Image,
} from 'react-native'
import SharedStyles from '../styles/shared/sharedStyles'
import ModalStyles from '../styles/shared/modalStyles'

const styles = SharedStyles.createStyles()
const modalStyles = ModalStyles.createStyles()

function ModalContainer({children, style, ...props}) {
  return (
    <View style={[modalStyles.modalContainer, style]} {...props}>
      {children}
    </View>
  )
}

function ModalActivityIndicator({children, style, ...props}) {
  return (
    <View style={[modalStyles.activityIndicator, style]} {...props}>
      {children}
    </View>
  )
}

function FlexRowCenter({children, style, ...props}) {
  return (
    <View style={[styles.flexRowCenter, style]} {...props}>
      {children}
    </View>
  )
}

function ActivityModal({children, ...props}) {
  return (
    <NativeModal transparent {...props}>
      <ModalContainer>
        <FlexRowCenter>
          <ModalActivityIndicator>{children}</ModalActivityIndicator>
        </FlexRowCenter>
      </ModalContainer>
    </NativeModal>
  )
}

function SpinnerActivity(props) {
  return <ActivityIndicator size="large" color="#FF20B1" {...props} />
}

function EmojiActivity(props) {
  return (
    <Image
      style={modalStyles.emojiActivityIndicator}
      source={require('../../assets/emoji-loader.png')}
      {...props}
    />
  )
}

export function LoadingScreen({children: _, ...props}) {
  return (
    <ActivityModal {...props}>
      <SpinnerActivity />
    </ActivityModal>
  )
}

export function SuccessScreen({children: _, ...props}) {
  return (
    <ActivityModal {...props}>
      <EmojiActivity />
    </ActivityModal>
  )
}
