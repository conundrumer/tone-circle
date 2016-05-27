// import { combineReducers } from 'redux'

const SELECT_LIMIT = 'SELECT_LIMIT'
const TOGGLE_RATIO = 'TOGGLE_RATIO'
const CLEAR_RATIOS = 'CLEAR_RATIOS'
const SELECT_RATIO_OPTION = 'SELECT_RATIO_OPTION'
const PLAY_TONE = 'PLAY_TONE'
const STOP_TONE = 'STOP_TONE'
const STOP_ALL = 'STOP_ALL'
const SET_PARAM = 'SET_PARAM'

export const selectLimit = (limitIndex) => ({ type: SELECT_LIMIT, limitIndex })
// factorArrayJson: array [n, m, ...] representing ratio 3^n * 5^m * ...
export const toggleRatio = (factorArrayJson) => ({ type: TOGGLE_RATIO, factorArrayJson })
export const clearRatios = () => ({ type: CLEAR_RATIOS })

export const selectRatioOption = (ratioFormat) => ({ type: SELECT_RATIO_OPTION, ratioFormat })

// tone is factorArrayJson
export const playTone = (tone) => ({ type: PLAY_TONE, tone })
export const stopTone = (tone) => ({ type: STOP_TONE, tone })
export const stopAll = () => ({ type: STOP_ALL })

export const setAudioParam = (paramName, paramValue) => ({ type: SET_PARAM, paramName, paramValue })
export const AudioParamNames = {
  VOLUME: 'volume',
  OCTAVES: 'octaves',
  OSC_TYPE: 'oscType'
}
const {VOLUME, OCTAVES, OSC_TYPE} = AudioParamNames

import queryString from 'query-string'
import {Base64} from './utils.js'
import {NO_OCTAVES} from './ratio-format.js'

const INIT = {
  limitIndex: 0,
  toggledRatios: {},
  playingTones: {},
  ratioFormat: NO_OCTAVES,
  audioParams: {
    [VOLUME]: -6,
    [OCTAVES]: 4,
    [OSC_TYPE]: 'sine'
  }
}

const {ratios} = queryString.parse(location.search)
if (ratios) {
  try {
    let parsed = ratios.split(' ').map((s) =>
      Array.prototype.map.call(s, Base64.toInt)
        .map((n) => n > 32 ? n - 64 : n)
    )
    for (let ratio of parsed) {
      INIT.toggledRatios[JSON.stringify(ratio)] = true
      INIT.limitIndex = Math.max(INIT.limitIndex, ratio.length - 1)
    }
  } catch (e) {
    alert('Could not parse ratios: ' + e.message)
  }
}

export default function rootReducer (state = INIT, action) {
  switch (action.type) {
    case SELECT_LIMIT:
      return Object.assign({}, state, {
        limitIndex: action.limitIndex
      })
    case TOGGLE_RATIO:
      let {factorArrayJson} = action
      let nextToggledRatios = Object.assign({}, state.toggledRatios)
      if (factorArrayJson in nextToggledRatios) {
        delete nextToggledRatios[factorArrayJson]
      } else {
        nextToggledRatios[factorArrayJson] = true
      }
      return Object.assign({}, state, {
        toggledRatios: nextToggledRatios
      })
    case CLEAR_RATIOS: {
      return Object.assign({}, state, {
        toggledRatios: {},
        playingTones: {}
      })
    }
    case SELECT_RATIO_OPTION:
      return Object.assign({}, state, {
        ratioFormat: action.ratioFormat
      })
    case PLAY_TONE:
      if (action.tone in state.playingTones) {
        return state
      }
      let nextPlayingTones = Object.assign({}, state.playingTones)
      nextPlayingTones[action.tone] = true
      return Object.assign({}, state, {
        playingTones: nextPlayingTones
      })
    case STOP_TONE:
      if (action.tone in state.playingTones) {
        let nextPlayingTones = Object.assign({}, state.playingTones)
        delete nextPlayingTones[action.tone]
        return Object.assign({}, state, {
          playingTones: nextPlayingTones
        })
      }
      return state
    case STOP_ALL:
      return Object.assign({}, state, {
        playingTones: {}
      })
    case SET_PARAM:
      return Object.assign({}, state, {
        audioParams: Object.assign({}, state.audioParams, {
          [action.paramName]: action.paramValue
        })
      })
  }
  return state
  // let nextState = reducers(state, action)
  // return nextState
}
