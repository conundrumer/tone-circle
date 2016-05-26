// import { combineReducers } from 'redux'

const SELECT_LIMIT = 'SELECT_LIMIT'
const TOGGLE_RATIO = 'TOGGLE_RATIO'
const SELECT_RATIO_OPTION = 'SELECT_RATIO_OPTION'

export const selectLimit = (limitIndex) => ({ type: SELECT_LIMIT, limitIndex })
// factorArrayJson: array [n, m, ...] representing ratio 3^n * 5^m * ...
export const toggleRatio = (factorArrayJson) => ({ type: TOGGLE_RATIO, factorArrayJson })

const PRIMES = [3, 5, 7, 11, 13]

export const RatioOptions = {
  COMPOSITE: 'Composite',
  FACTORED: 'Factored',
  NO_OCTAVES: 'Factored Without Octaves'
}
export const selectRatioOption = (option) => ({ type: SELECT_RATIO_OPTION, option})

const INIT = {
  primes: PRIMES,
  limitIndex: 0,
  toggledRatios: {},
  ratioOption: RatioOptions.COMPOSITE
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
        ratioOption: action.option
      })
  }
  return state
  // let nextState = reducers(state, action)
  // return nextState
}
