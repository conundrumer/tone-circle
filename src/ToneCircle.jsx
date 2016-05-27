import React from 'react'

import CompoundFraction from './CompoundFraction.jsx'

const K = 200

const STROKE_WIDTH = K * 0.02

const PointColor = '#FFFF8D'
const PointColorActive = '#64DD17'
const PointStrokeColor = '#212121'
const PrimeColors = ['#CDDC39', '#4CAF50', '#2196F3', '#90A4AE', '#FF5722']
const ToneCircleColor = '#616161'

const rotate90 = (a) => a - Math.PI / 2

const ToneRatioTransform = `translate(${K * -0.5} ${K * -0.5})`
const ToneRatioContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: K,
  height: K,
  fontSize: K * 0.08
}
const ToneRatioStyles = {
  padding: K * 0.02,
  border: `${K * 0.005}px solid #aaa`,
  backgroundColor: 'rgba(255,255,255,0.7)',
  borderRadius: 10
}
const ToneRatio = ({ratio}) => (
  <g transform={`translate(
    ${1.25 * K * Math.cos(rotate90(ratio.angle))},
    ${1.25 * K * Math.sin(rotate90(ratio.angle))})`
  }>
    <circle r={1} fill='none'/>
    <foreignObject transform={ToneRatioTransform}>
      <div style={ToneRatioContainerStyles}>
        <div style={ToneRatioStyles}>
          <CompoundFraction ratio={ratio} />
        </div>
      </div>
    </foreignObject>
  </g>
)

const TonePoint = ({ratio: {angle}, playing, onPlay, onStop}) => (
  <circle
    cx={K * Math.cos(rotate90(angle))}
    cy={K * Math.sin(rotate90(angle))}
    r={3 * STROKE_WIDTH}
    fill={playing ? PointColorActive : PointColor}
    stroke={PointStrokeColor}
    strokeWidth={0.4 * STROKE_WIDTH}
    onMouseDown={onPlay}
    onMouseUp={onStop}
  />
)

const IntervalLine = ({edge: {a, b, diff, primeIndex}}) => (
  <line
    x1={K * Math.cos(rotate90(a.angle))}
    y1={K * Math.sin(rotate90(a.angle))}
    x2={K * Math.cos(rotate90(b.angle))}
    y2={K * Math.sin(rotate90(b.angle))}
    stroke={PrimeColors[primeIndex]}
    opacity={0.6 * (1 - 0.7 * Math.abs(diff))}
    strokeWidth={STROKE_WIDTH}
    markerEnd={`url(#arrow-${primeIndex})`}
  />
)

const IntervalArrowhead = ({color, i}) => (
  <marker
    id={`arrow-${i}`}
    viewBox='0 0 2 2'
    refX={3} refY={1}
    markerWidth={6}
    markerHeight={6}
    orient='auto'
    fill={color}
  >
    <path d='M 0,0 L 2,1 L 0,2 z' />
  </marker>
)

const PAD = 0.5
const VIEW_BOX = [-1, -1, 2, 2].map((s) => (s * (1 + PAD)) * K)
export const ToneCircle = ({edges, points, playingTones, actions: {playTone, stopTone}}) => (
  <div className='tone-circle-container'>
    <svg className='tone-circle-svg' viewBox={VIEW_BOX} onMouseDown={(e) => e.preventDefault()}>
       <defs>
        {
          PrimeColors.map((color, i) =>
            <IntervalArrowhead key={i} color={color} i={i} />
          )
        }
      </defs>
      {
        points.map((ratio) => <ToneRatio key={ratio.json} ratio={ratio} />)
      }
      <circle cx={0} cy={0} r={K} fill='none' stroke={ToneCircleColor} strokeWidth={2 * STROKE_WIDTH}/>
      {
        edges.map((edge, i) =>
          <IntervalLine key={edge.a.json + edge.b.json} edge={edge} />
        )
      }
      {
        points.map((ratio) =>
          <TonePoint
            key={ratio.json}
            ratio={ratio}
            playing={playingTones[ratio.json]}
            onPlay={() => playTone(ratio.json)}
            onStop={() => stopTone(ratio.json)}
          />
        )
      }
    </svg>
  </div>
)

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {playTone, stopTone} from './reducer.js'
import {toneCircleSelector as mapStateToProps} from './selectors.js'

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({playTone, stopTone}, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ToneCircle)
