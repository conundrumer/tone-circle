import React from 'react'

const STROKE_WIDTH = 0.02

const PointColor = '#FFFF8D'
const PointColorActive = '#64DD17'
const PointStrokeColor = '#212121'
const PrimeColors = ['#CDDC39', '#4CAF50', '#2196F3', '#90A4AE', '#FF5722']
const ToneCircleColor = '#616161'

const TonePoint = ({ratio: {angle}, playing, onPlay, onStop}) => (
  <g>
    <circle
      cx={Math.cos(angle)}
      cy={Math.sin(angle)}
      r={2 * STROKE_WIDTH}
      fill={playing ? PointColorActive : PointColor}
      stroke={PointStrokeColor}
      strokeWidth={0.4 * STROKE_WIDTH}
      onMouseDown={onPlay}
      onMouseUp={onStop}
    />
  </g>
)

const IntervalLine = ({edge: {a, b, diff, primeIndex}}) => (
  <line
    x1={Math.cos(a.angle)}
    y1={Math.sin(a.angle)}
    x2={Math.cos(b.angle)}
    y2={Math.sin(b.angle)}
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
    refX='2.8' refY='1'
    markerWidth={4}
    markerHeight={4}
    orient='auto'
    fill={color}
  >
    <path d='M 0,0 L 2,1 L 0,2 z' />
  </marker>
)

export const ToneCircle = ({edges, points, playingTones, actions: {playTone, stopTone}}) => (
  <div className='tone-circle-container'>
    <svg className='tone-circle-svg' viewBox='-1.2 -1.2 2.4 2.4' onMouseDown={(e) => e.preventDefault()}>
       <defs>
        {
          PrimeColors.map((color, i) =>
            <IntervalArrowhead key={i} color={color} i={i} />
          )
        }
      </defs>
      <g transform='rotate(-90)'>
        <circle cx={0} cy={0} r={1} fill='none' stroke={ToneCircleColor} strokeWidth={2 * STROKE_WIDTH}/>
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
      </g>
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
