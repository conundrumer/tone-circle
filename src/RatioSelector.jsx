import React from 'react'

import {RatioOptions} from './reducer.js'

const DOT = '·'

const CompoundFraction = ({over, under, num, dem, octave, viewFactored, viewOctaves}) => (
  <div className='compound-fraction'>
    <span className='fraction'>
      <sup>{viewFactored ? over : num * (octave > 0 ? Math.pow(2, octave) : 1)}</sup>
      <span>/</span>
      <sub>{viewFactored ? under : dem * (octave < 0 ? Math.pow(2, -octave) : 1)}</sub>
    </span>
    {
      viewOctaves ? <span>&nbsp;{DOT} 2<sup>{octave}</sup></span> : null
    }
  </div>
)

export const RatioSelector = ({
  primes,
  limitIndex,
  toggledRatios,
  enabledRatioOrders,
  selectLimit,
  toggleRatio,
  selectRatioOption,
  ratioOption,
  viewFactored,
  viewOctaves
}) => (
  <div>
    <h2>Ratio Selector</h2>
    <div>
      <h4>View Ratios as</h4>
      {
        Object.keys(RatioOptions).map((key) => RatioOptions[key]).map((option, i) =>
          <div key={i} style={{padding: 5}}>
            <label>{option}:</label>
            <input type='radio' checked={ratioOption === option} onChange={() => selectRatioOption(option)} />
          </div>
        )
      }
    </div>
    <div>
      <h3>Limit</h3>
      {
        primes.map((prime, i) =>
          <span key={i} style={{padding: 5}}>
            <label>{prime}:</label>
            <input type='radio' checked={i === limitIndex} onChange={() => selectLimit(i)} />
          </span>
        )
      }
    </div>
    <div>
      <h3>Ratios</h3>
      {
        enabledRatioOrders.map((enabledRatios, i) =>
          <div key={i}>
            <span>Order {i + 1}</span>
            {
              enabledRatios.map((props) =>
                <span key={props.json} className='ratio-container'>
                  <CompoundFraction {...props} {...{viewFactored, viewOctaves}} />
                  <input type='checkbox' checked={props.json in toggledRatios} onChange={() => toggleRatio(props.json)} />
                </span>
              )
            }
          </div>

        )
      }
    </div>
  </div>
)

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import {selectLimit, toggleRatio, selectRatioOption} from './reducer.js'
import {factorArrayToJson} from './utils.js'

const getRatioInfo = createSelector(
  (state) => state.primes,
  (state) => state.limitIndex,
  (state) => state.toggledRatios,
  (primes, limitIndex, toggledRatios) => {
    function makeRatio (factorArray) {
      const getComposite = (factorArray) =>
        factorArray.map((n, i) =>
            n > 0 ? Math.pow(primes[i], n) : 1
          )
          .reduce((p, k) => p * k, 1)

      const renderFactors = (factorArray) =>
        factorArray.map((n) => Math.max(n, 0))
          .map((n, i) =>
            Array(n).fill(primes[i]).join(DOT)
          )
          .filter((s) => s !== '')
          .join(DOT)

      let num = getComposite(factorArray)
      let dem = getComposite(factorArray.map((n) => -n))

      return {
        num,
        dem,
        octave: -Math.floor(Math.log2(num / dem)),
        over: num === 1 ? '1' : renderFactors(factorArray),
        under: dem === 1 ? '1' : renderFactors(factorArray.map((n) => -n)),
        json: factorArrayToJson(factorArray),
        factorArray
      }
    }

    const getNextRatios = (factorArray, n) => {
      let over = [...factorArray]
      let under = [...factorArray]
      over[n] += 1
      under[n] -= 1
      return [makeRatio(over), makeRatio(under)]
    }

    const getEnabledRatioOrders = () => {
      let enabledRatioOrders = [[makeRatio(Array(limitIndex + 1).fill(0))]]
      let seenRatios = new Set([enabledRatioOrders[0][0].json])
      for (let i = 0; i < enabledRatioOrders.length; i++) {
        for (let enabledRatio of enabledRatioOrders[i]) {
          if (!(i === 0 || enabledRatio.json in toggledRatios)) {
            continue
          }
          for (let n = 0; n <= limitIndex; n++) {
            for (let ratio of getNextRatios(enabledRatio.factorArray, n)) {
              if (seenRatios.has(ratio.json)) continue
              seenRatios.add(ratio.json)
              if (!enabledRatioOrders[i + 1]) {
                enabledRatioOrders.push([])
              }
              enabledRatioOrders[i + 1].push(ratio)
            }
          }
        }
      }
      enabledRatioOrders.shift()
      return enabledRatioOrders
    }
    return {primes, limitIndex, toggledRatios, enabledRatioOrders: getEnabledRatioOrders()}
  }
)

const getRatioOption = createSelector(
  (state) => state.ratioOption,
  (option) => {
    switch (option) {
      case RatioOptions.COMPOSITE:
        return { ratioOption: option, viewFactored: false, viewOctaves: false }
      case RatioOptions.FACTORED:
        return { ratioOption: option, viewFactored: true, viewOctaves: true }
      case RatioOptions.NO_OCTAVES:
        return { ratioOption: option, viewFactored: true, viewOctaves: false }
    }
  }
)

const mapStateToProps = createSelector(
  getRatioInfo,
  getRatioOption,
  (a, b) => Object.assign({}, a, b)
)

const mapDispatchToProps = (dispatch) => bindActionCreators({selectLimit, toggleRatio, selectRatioOption}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RatioSelector)
