export {default} from './hot-reload-utils.js'
import {logUnload, logReload} from './hot-reload-utils.js'
export const unload = () => logUnload('tone-player.js')
export const reload = () => logReload('tone-player.js')

let tones
export function reloadTones (nextTones) {
  return tones || (tones = nextTones)
}

let chain
export function reloadChain (nextChain) {
  return chain || (chain = nextChain)
}
