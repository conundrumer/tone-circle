import __HOT__, {reloadTones, reloadChain, unload} from './tone-player.hot.js'

let unsubscribeStore
export function __unload () {
  unsubscribeStore && unsubscribeStore()
  unload()
}

import diff from 'shallow-diff'

import {observeStore} from './utils.js'
import {tonePlayerSelector} from './selectors.js'

const toLinear = (v) => Math.pow(10, v / 10)

function hann (x, w) {
  return 0.5 + 0.5 * Math.cos(Math.PI * Math.min(w, Math.max(-w, x)) / w)
}

function flatBell (x, w, p) {
  let y = 1
  if (x > 0.5) {
    y = hann(x - 0.5, w - 0.5)
  }
  if (x < -0.5) {
    y = hann(x + 0.5, w - 0.5)
  }
  // console.log(x, y)
  return Math.pow(y, p)
}

function createOsc (ctx, gain, freq, oscType, destination) {
  let osc = ctx.createOscillator()
  let gainNode = ctx.createGain()
  osc.frequency.value = freq
  osc.type = oscType
  gainNode.gain.value = 0
  osc.connect(gainNode)
  gainNode.connect(destination)
  return {
    start () {
      osc.start()
      gainNode.gain.value = gain
    },
    stop () {
      gainNode.gain.value = 0
      setTimeout(() => osc.stop(), 0)
    }
  }
}

function createTone (ctx, tone, destination, {center, octaves, oscType}) {
  let pitch = Math.log2(tone.ratio)
  let base = center * tone.ratio
  if (octaves > 0 && pitch > 0.5) {
    pitch -= 1
    base /= 2
  }
  let oscs = Array(2 * octaves + 1).fill()
    .map((_, i) => i - octaves)
    .map((octave) => [
      octaves === 0 ? 1
      : flatBell(octave + pitch, octaves + 0.5, 1),
      base * Math.pow(2, octave)
    ])
    .map(([gain, freq]) =>
      createOsc(ctx, gain, freq, oscType, destination)
    )
  return {
    start () {
      // console.log('played:', tone.json)
      oscs.forEach((o) => o.start())

    },
    stop () {
      // console.log('stopped:', tone.json)
      oscs.forEach((o) => o.stop())
    }
  }
}

// compressor.reduction.value
function createChain (ctx) {
  let normNode = ctx.createGain()
  let gainNode = ctx.createGain()
  let compressor = ctx.createDynamicsCompressor()
  normNode.connect(gainNode)
  gainNode.connect(compressor)
  compressor.connect(ctx.destination)
  return {
    source: normNode,
    setVolume (v) {
      gainNode.gain.value = toLinear(v)
    },
    setNumVoices (n) {
      normNode.gain.value = Math.sqrt(1 / Math.max(1, n))
    }
  }
}

export default function createTonePlayer (store, ctx) {
  let tones = {}
  let chain = createChain(ctx)

  if (__HOT__) {
    tones = reloadTones(tones)
    chain = reloadChain(chain)
  }

  let unsubscribe = observeStore(
    store,
    tonePlayerSelector,
    ({tones: nextTones, audioParams: {volume, octaves, oscType}}, {tones: prevTones} = {}) => {
      // console.log('tone onNext', new Date().toLocaleTimeString())

      const center = 440 // a4

      let {deleted = [], added = []} = nextTones !== prevTones ? diff(tones, nextTones) : {}
      for (let stoppedTone of deleted) {
        tones[stoppedTone].stop()
        delete tones[stoppedTone]
      }
      for (let playedTone of added) {
        let tone = createTone(ctx, nextTones[playedTone], chain.source, {center, octaves, oscType})
        tone.start()
        tones[playedTone] = tone
      }
      chain.setVolume(volume)
      chain.setNumVoices(Object.keys(tones).length)
    }
  )

  if (__HOT__) unsubscribeStore = unsubscribe

  return unsubscribe
}
