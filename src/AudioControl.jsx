import React from 'react'
import {AudioParamNames} from './reducer.js'
const {VOLUME, OCTAVES, OSC_TYPE} = AudioParamNames

const AudioParam = ({name, value, min, max, step, onChange}) => (
  <span>
    <label>{name}:
      &nbsp;
      <span style={{
        display: 'inline-block',
        width: '2em'
      }}>
        {value}
      </span>
      &nbsp;
    </label>
    <input
      type='range'
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(parseFloat(e.target.value))}
    />
  </span>
)

export const AudioControl = ({
  audioParams: {
    [VOLUME]: volume,
    [OSC_TYPE]: oscType,
    [OCTAVES]: octaves
  },
  actions: {
    setAudioParam,
    stopAll
  }
}) => (
  <div className='audio-control'>
    <span>
      <button onClick={() => stopAll()}>Stop All</button>
    </span>
    <AudioParam
      name={'Volume'}
      value={volume}
      min={-15}
      max={0}
      step={0.5}
      onChange={(v) => setAudioParam(VOLUME, v)}
    />
    <AudioParam
      name={'Octaves'}
      value={octaves}
      min={0}
      max={4}
      step={1}
      onChange={(v) => setAudioParam(OCTAVES, v)}
    />
    <span>
      <label>Oscillator Type: </label>
      <select value={oscType} onChange={(e) => setAudioParam(OSC_TYPE, e.target.value)}>
        <option value='sine'>Sine</option>
        <option value='square'>Square</option>
        <option value='sawtooth'>Sawtooth</option>
        <option value='triangle'>Triangle</option>
      </select>
    </span>
  </div>
)

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {setAudioParam, stopAll} from './reducer.js'
import {audioControlSelector as mapStateToProps} from './selectors.js'

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({setAudioParam, stopAll}, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AudioControl)
