export {default} from './hot-reload-utils.js'
import {logUnload, logReload} from './hot-reload-utils.js'
export const unload = () => logUnload('configureStore.js')
export const reload = () => logReload('configureStore.js')

let currentMiddlewares
export function reloadMiddlewares (nextMiddlewares) {
  if (!currentMiddlewares) {
    currentMiddlewares = nextMiddlewares
    return currentMiddlewares.map((_, i) =>
      (store) => (next) => (action) => currentMiddlewares[i](store)(next)(action)
    )
  } else { // if not initialLoad, returned middlewares do nothing
    currentMiddlewares = nextMiddlewares
    return nextMiddlewares
  }
}

let currentStore
export function reloadStore (nextStore, nextReducer) {
  if (!currentStore) {
    currentStore = nextStore
    window.store = nextStore
  } else { // need to reuse old store
    currentStore.replaceReducer(nextReducer)
  }
  return currentStore
}
