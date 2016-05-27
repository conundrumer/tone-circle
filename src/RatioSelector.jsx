import React from 'react'

import CompoundFraction from './CompoundFraction.jsx'
import {Primes} from './utils.js'

export const RatioSelector = ({
  actions: {
    selectLimit,
    toggleRatio,
    selectRatioOption,
    clearRatios
  },
  ratioInfo: {
    limitIndex,
    toggledRatios,
    enabledRatioOrders
  },
  ratioOptions,
  ratioURL
}) => (
  <div style={{padding: 15}}>
    <h2>Ratio Selector</h2>
    <div>
      <h4>View Ratios as</h4>
      <ul>
      {
        ratioOptions.map(({option, label, selected}, i) =>
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
      <p> URL: <a href={ratioURL}>{ratioURL}</a> </p>
      <button onClick={() => clearRatios()}>Clear</button>
      {
        enabledRatioOrders.map((enabledRatios, i) =>
          i === 0 ? null :
          <div key={i}>
            <span>Order {i}</span>
            {
              enabledRatios.map((ratio) =>
                <span key={ratio.json} className='ratio-container'>
                  <CompoundFraction ratio={ratio} />
                  <input type='checkbox' checked={ratio.json in toggledRatios} onChange={() => toggleRatio(ratio.json)} />
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

import {selectLimit, toggleRatio, selectRatioOption, clearRatios} from './reducer.js'
import {ratioSelectorSelector as mapStateToProps} from './selectors.js'

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({selectLimit, toggleRatio, selectRatioOption, clearRatios}, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RatioSelector)
