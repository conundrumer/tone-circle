import { createSelector, createStructuredSelector } from 'reselect'

import {getEnabledRatioOrders} from './utils.js'
import RatioFormatInfo, {ratioFormats} from './ratio-format.js'

const getRatioInfo = createSelector(
  (state) => state.limitIndex,
  (state) => state.toggledRatios,
  (limitIndex, toggledRatios) => ({
    enabledRatioOrders: getEnabledRatioOrders(limitIndex, toggledRatios),
    limitIndex,
    toggledRatios
  })
)

const getRatioFormat = createSelector(
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
  ratioInfo: getRatioInfo,
  ratioFormat: getRatioFormat
})
