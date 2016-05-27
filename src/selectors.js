import { createSelector, createStructuredSelector } from 'reselect'

import {getEnabledRatioOrders, getRatioEdges, getActiveRatios} from './utils.js'
import RatioFormatInfo, {ratioFormats} from './ratio-format.js'

const ratioInfoSelector = createSelector(
  (state) => state.limitIndex,
  (state) => state.toggledRatios,
  (limitIndex, toggledRatios) => ({
    enabledRatioOrders: getEnabledRatioOrders(limitIndex, toggledRatios),
    limitIndex,
    toggledRatios
  })
)

const ratioFormatSelector = createSelector(
  (state) => state.ratioFormat,
  (ratioFormat) => {
    let {viewFactored, viewOctaves} = RatioFormatInfo[ratioFormat]
    let options = ratioFormats.map((option) => ({
      option,
      label: RatioFormatInfo[option].label,
      selected: option === ratioFormat
    }))
    return {options, viewFactored, viewOctaves}
  }
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

export const ratioSelectorSelector = createStructuredSelector({
  ratioInfo: ratioInfoSelector,
  ratioFormat: ratioFormatSelector
})

export const toneCircleSelector = createStructuredSelector({
  points: pointSelector,
  edges: edgeSelector,
  playingTones: (state) => state.playingTones
})
