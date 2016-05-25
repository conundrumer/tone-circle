/* hot reload things */
import 'systemjs-hot-reloader/default-listener.js'
import __HOT__, {makeForceRerender} from './main.hot.js'
export {unload as __unload, reload as __reload} from './main.hot.js'

/* main.js */

import App from './App.jsx'
import render from './render.jsx'
import configureStore from './configureStore.js'

let store = configureStore()

let container = document.getElementById('container')
const renderApp = () => render(App, store, container)
renderApp()

if (__HOT__) makeForceRerender(renderApp, container)
