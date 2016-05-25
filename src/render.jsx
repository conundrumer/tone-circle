import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

export default (Component, store, container) => (
  ReactDOM.render(
    <Provider store={store}>
      <Component />
    </Provider>,
    container
  )
)
