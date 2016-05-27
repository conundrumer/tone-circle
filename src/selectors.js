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

export const ratioSelectorSelector = createStructuredSelector({
  ratioInfo: ratioInfoSelector,
  ratioFormat: ratioFormatSelector
})

export const toneCircleSelector = createSelector(
  ratioInfoSelector,
  (state) => state.limitIndex,
  ({enabledRatioOrders, toggledRatios}, limitIndex) => {
    let points = getActiveRatios(enabledRatioOrders, toggledRatios)
    return {
      points,
      edges: getRatioEdges(points, limitIndex)
    }
  }
)
