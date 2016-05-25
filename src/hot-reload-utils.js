export default true

const getTime = () => new Date().toLocaleTimeString()

export function logUnload (filename) {
  return console.info(`[${getTime()}] Unloaded ${filename}`)
}

export function logReload (filename) {
  return console.info(`[${getTime()}] Reloaded ${filename}`)
}
