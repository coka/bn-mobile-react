import React from 'react'
import {Text} from 'react-native'
import {render} from 'react-native-testing-library'
import BusyButton from '../../src/BusyButton'

it('renders', () => {
  const {queryByText} = render(
    <BusyButton>
      <Text>Hi</Text>
    </BusyButton>
  )

  expect(queryByText('Hi')).not.toBeNull()
  expect(queryByText('Loading')).toBeNull()
})

it('renders default busy content when busy', () => {
  const {queryByText} = render(
    <BusyButton isBusy>
      <Text>Hi</Text>
    </BusyButton>
  )

  expect(queryByText('Loading')).not.toBeNull()
  expect(queryByText('Hi')).toBeNull()
})
