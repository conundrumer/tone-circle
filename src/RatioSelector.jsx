import React from 'react'

import {DOT, Primes} from './utils.js'

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
  actions: {
    selectLimit,
    toggleRatio,
    selectRatioOption
  },
  ratioInfo: {
    limitIndex,
    toggledRatios,
    enabledRatioOrders
  },
  ratioFormat: {
    options,
    viewFactored,
    viewOctaves
  }
}) => (
  <div>
    <h2>Ratio Selector</h2>
    <div>
      <h4>View Ratios as</h4>
      <ul>
      {
        options.map(({option, label, selected}, i) =>
          <li key={i} style={{padding: 5}}>
            <label>{label}:</label>
            <input type='radio' checked={selected} onChange={() => selectRatioOption(option)} />
          </li>
        )
      }
      </ul>
    </div>
    <div>
      <h3>Limit</h3>
      {
        Primes.map((prime, i) =>
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

import {selectLimit, toggleRatio, selectRatioOption} from './reducer.js'
import {ratioSelectorSelector as mapStateToProps} from './selectors.js'

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({selectLimit, toggleRatio, selectRatioOption}, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RatioSelector)
