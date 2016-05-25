import __HOT__, {reloadMiddlewares, reloadStore} from './configureStore.hot.js'
export {unload as __unload, reload as __reload} from './configureStore.hot.js'

import { applyMiddleware, createStore, compose } from 'redux'

import reducer from './reducer.js'
import log from './log-middleware.js'

export default function configureStore () {
  let middlewares = [log]

  if (__HOT__) middlewares = reloadMiddlewares(middlewares)

  let enhancer = applyMiddleware(...middlewares)

  if (window.devToolsExtension) {
    enhancer = compose(enhancer, window.devToolsExtension())
  }

  let store = createStore(reducer, enhancer)

  if (__HOT__) store = reloadStore(store, reducer)

  return store
}
