// import { combineReducers } from 'redux'

const SELECT_LIMIT = 'SELECT_LIMIT'
const TOGGLE_RATIO = 'TOGGLE_RATIO'
const SELECT_RATIO_OPTION = 'SELECT_RATIO_OPTION'
const PLAY_TONE = 'PLAY_TONE'
const STOP_TONE = 'STOP_TONE'

export const selectLimit = (limitIndex) => ({ type: SELECT_LIMIT, limitIndex })
// factorArrayJson: array [n, m, ...] representing ratio 3^n * 5^m * ...
export const toggleRatio = (factorArrayJson) => ({ type: TOGGLE_RATIO, factorArrayJson })

export const selectRatioOption = (ratioFormat) => ({ type: SELECT_RATIO_OPTION, ratioFormat })

// tone is factorArrayJson
export const playTone = (tone) => ({ type: PLAY_TONE, tone })
export const stopTone = (tone) => ({ type: STOP_TONE, tone })

import {COMPOSITE} from './ratio-format.js'

const INIT = {
  limitIndex: 0,
  toggledRatios: {},
  playingTones: {},
  ratioFormat: COMPOSITE
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
  }
  return state
  // let nextState = reducers(state, action)
  // return nextState
}
