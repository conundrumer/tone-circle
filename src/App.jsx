import React from 'react'

import RatioSelector from './RatioSelector.jsx'
import ToneCircle from './ToneCircle.jsx'
import AudioControl from './AudioControl.jsx'

export default () => (
  <div>
    <h1 style={{textAlign: 'center'}}>Tone Circle</h1>
    <ToneCircle />
    <AudioControl />
    <RatioSelector />
  </div>
)
