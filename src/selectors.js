import { createSelector, createStructuredSelector } from 'reselect'

import {getEnabledRatioOrders, getRatioEdges, getActiveRatios} from './utils.js'
import RatioFormatInfo, {ratioFormats} from './ratio-format.js'
import {Base64} from './utils.js'

const ratioInfoSelector = createSelector(
  (state) => state.limitIndex,
  (state) => state.toggledRatios,
  (limitIndex, toggledRatios) => ({
    enabledRatioOrders: getEnabledRatioOrders(limitIndex, toggledRatios),
    limitIndex,
    toggledRatios
  })
)

const ratioOptionsSelector = createSelector(
  (state) => state.ratioFormat,
  (ratioFormat) =>
    ratioFormats.map((option) => ({
      option,
      label: RatioFormatInfo[option].label,
      selected: option === ratioFormat
    }))
)

const pointSelector = createSelector(
  ratioInfoSelector,
  ({enabledRatioOrders, toggledRatios}) => (
    getActiveRatios(enabledRatioOrders, toggledRatios)
  )
)

const edgeSelector = createSelector(
  pointSelector,
  (state) => state.limitIndex,
  (points, limitIndex) => (
    getRatioEdges(points, limitIndex)
  )
)

const toneSelector = createSelector(
  pointSelector,
  (state) => state.playingTones,
  (points, playingTones) => {
    let activePlayingTones = {}
    for (let point of points) {
      if (point.json in playingTones) {
        activePlayingTones[point.json] = point
      }
    }
    return activePlayingTones
  }
)

function removeTrailingZeros (array) {
  array = [...array]
  while (array[array.length - 1] === 0) {
    array.pop()
  }
  return array
}

const ratioURLSelector = createSelector(
  pointSelector,
  ([, ...activeRatios]) =>
    window.location.origin + window.location.pathname + '?ratios=' +
    activeRatios.map(({factorArray}) =>
      removeTrailingZeros(factorArray).map(Base64.fromInt).join('')
    ).join('+')
)

export const ratioSelectorSelector = createStructuredSelector({
  ratioInfo: ratioInfoSelector,
  ratioOptions: ratioOptionsSelector,
  ratioURL: ratioURLSelector
})

export const toneCircleSelector = createStructuredSelector({
  points: pointSelector,
  edges: edgeSelector,
  playingTones: (state) => state.playingTones
})

export const tonePlayerSelector = createStructuredSelector({
  tones: toneSelector,
  audioParams: (state) => state.audioParams
})

export const audioControlSelector = createStructuredSelector({
  audioParams: (state) => state.audioParams
})

export const compoundFractionSelector = createSelector(
  (state) => state.ratioFormat,
  (_, props) => props.ratio,
  (ratioFormat, ratio) => {
    let {viewFactored, viewOctaves} = RatioFormatInfo[ratioFormat]
    return Object.assign({viewFactored, viewOctaves}, ratio)
  }
)
