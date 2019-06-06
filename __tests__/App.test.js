import React from 'react'
import App from '../App'

import ShallowRenderer from 'react-test-renderer/shallow'
const renderer = new ShallowRenderer()

it('renders without crashing', () => {
  const rendered = renderer.render(<App />)

  expect(rendered).toBeTruthy()
})
