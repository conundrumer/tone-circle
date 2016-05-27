/* hot reload things */
import 'systemjs-hot-reloader/default-listener.js'
import __HOT__, {makeForceRerender, reloadAudioContext, unload} from './main.hot.js'
export {reload as __reload} from './main.hot.js'

let unsubscribeTonePlayer
export function __unload () {
  unsubscribeTonePlayer && unsubscribeTonePlayer()
  unload()
}

/* main.js */

import App from './App.jsx'
import render from './render.jsx'
import configureStore from './configureStore.js'
import createTonePlayer from './tone-player.js'

let store = configureStore()

/* tone player */
let getAudioContext = () => (console.log('created audio context'), new AudioContext())

if (__HOT__) getAudioContext = reloadAudioContext(getAudioContext)

unsubscribeTonePlayer = createTonePlayer(store, getAudioContext())

/* react */
let container = document.getElementById('container')
const renderApp = () => render(App, store, container)
renderApp()

if (__HOT__) makeForceRerender(renderApp, container)
