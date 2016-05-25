export {default} from './hot-reload-utils.js'
import {logUnload, logReload} from './hot-reload-utils.js'
export const unload = () => logUnload('main.js')
export const reload = () => logReload('main.js')

// window.forceRerender()
import ReactDOM from 'react-dom'
export function makeForceRerender (renderApp, container) {
  window.forceRerender = () => {
    try {
      ReactDOM.unmountComponentAtNode(container)
    } catch (e) {
      container.innerHTML = ''
    }
    renderApp()
  }
}
