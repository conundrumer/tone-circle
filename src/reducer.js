// import { combineReducers } from 'redux'

const SELECT_LIMIT = 'SELECT_LIMIT'
const TOGGLE_RATIO = 'TOGGLE_RATIO'
const SELECT_RATIO_OPTION = 'SELECT_RATIO_OPTION'

export const selectLimit = (limitIndex) => ({ type: SELECT_LIMIT, limitIndex })
// factorArrayJson: array [n, m, ...] representing ratio 3^n * 5^m * ...
export const toggleRatio = (factorArrayJson) => ({ type: TOGGLE_RATIO, factorArrayJson })

export const selectRatioOption = (ratioFormat) => ({ type: SELECT_RATIO_OPTION, ratioFormat })

import {COMPOSITE} from './ratio-format.js'

const INIT = {
  limitIndex: 0,
  toggledRatios: {},
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
  }
  return state
  // let nextState = reducers(state, action)
  // return nextState
}
