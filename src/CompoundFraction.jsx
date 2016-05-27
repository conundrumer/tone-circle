import React from 'react'

import {DOT, Primes} from './utils.js'

const Factors = ({className, viewFactored, factors, composite, octave}) => {
  factors = factors.map((f) => Math.max(0, f))
  let out
  let numFactors = factors.reduce((s, x) => s + x)
  if (!viewFactored) {
    out = composite * Math.pow(2, Math.max(0, octave))
  } else if (numFactors === 0) {
    out = 1
  } else if (numFactors < 4) {
    out = factors.map((n, i) => n === 0 ? '' : Array(n).fill(Primes[i]).join(DOT)).filter(s => s !== '').join(DOT)
  } else {
    [, ...out] = factors.map((n, i) => n === 0 ? '' : n === 1 ? Primes[i] :
      <span key={i}>
        {Primes[i]}<sup>{n}</sup>
      </span>
    ).filter(s => s !== '').map((e) => [DOT, e]).reduce((s, a) => [...s, ...a])
  }
  return (
    <span className={className}>
      {out}
    </span>
  )
}

const CompoundFraction = ({viewFactored, viewOctaves, factorArray, num, dem, octave}) => (
  <div className='compound-fraction'>
    <span className='fraction'>
      <Factors className='num' viewFactored={viewFactored} factors={factorArray} composite={num} octave={octave} />
      <span>/</span>
      <Factors className='dem' viewFactored={viewFactored} factors={factorArray.map(f => -f)} composite={dem} octave={-octave} />
    </span>
    {
      viewOctaves ? <span>&nbsp;{DOT} 2<sup>{octave}</sup></span> : null
    }
  </div>
)

import { connect } from 'react-redux'

import {compoundFractionSelector as mapStateToProps} from './selectors.js'

export default connect(mapStateToProps)(CompoundFraction)
