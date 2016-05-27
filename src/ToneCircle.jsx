import React from 'react'

const STROKE_WIDTH = 0.02

const PointColor = '#FFFF8D'
const PointColorActive = '#64DD17'
const PrimeColors = ['#CDDC39', '#4CAF50', '#2196F3', '#90A4AE', '#FF5722']

const RatioPoint = ({ratio: {angle, json}}) => (
  <g>
    <circle
      cx={Math.cos(angle)}
      cy={Math.sin(angle)}
      r={2 * STROKE_WIDTH}
      fill={PointColor}
      stroke='#212121'
      strokeWidth={0.4 * STROKE_WIDTH}
      onMouseDown={(e) => { e.preventDefault(); console.log('down', json)}}
      onMouseUp={(e) => { e.preventDefault(); console.log('up', json)}}
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

export const ToneCircle = ({edges, points}) => (
  <div className='tone-circle-container'>
    <svg className='tone-circle-svg' viewBox='-1.2 -1.2 2.4 2.4'>
       <defs>
        <filter id='drop-shadow-2' x={-1} y={-1} width='400%' height='400%'>
          <feOffset result='offOut' in='SourceGraphic' dx={-1 * STROKE_WIDTH} dy={0} />
          <feGaussianBlur result='blurOut' in='offOut' stdDeviation={0.9 * STROKE_WIDTH} />
          <feBlend in='SourceGraphic' in2='blurOut' mode='normal' />
        </filter>
        <filter id='drop-shadow-1' x={-1} y={-1} width='400%' height='400%'>
          <feOffset result='offOut' in='SourceGraphic' dx={-0.5 * STROKE_WIDTH} dy={0} />
          <feGaussianBlur result='blurOut' in='offOut' stdDeviation={0.5 * STROKE_WIDTH} />
          <feBlend in='SourceGraphic' in2='blurOut' mode='normal' />
        </filter>
        {
          PrimeColors.map((color, i) =>
            <marker
              key={i}
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
        }
      </defs>
      <g transform='rotate(-90)'>
        <circle cx={0} cy={0} r={1} fill='none' stroke='#616161' strokeWidth={2 * STROKE_WIDTH}/>
        {
          edges.map((edge, i) =>
            <IntervalLine key={edge.a.json + edge.b.json} edge={edge} />
          )
        }
        {
          points.map((ratio) =>
            <RatioPoint key={ratio.json} ratio={ratio} />
          )
        }
      </g>
    </svg>
  </div>
)

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import {} from './reducer.js'
import {toneCircleSelector as mapStateToProps} from './selectors.js'

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({}, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ToneCircle)
