export function observeStore (store, select, onChange) {
  let currentState

  function handleChange () {
    let nextState = select(store.getState())
    if (nextState !== currentState) {
      onChange(nextState, currentState)
      currentState = nextState
    }
  }

  let unsubscribe = store.subscribe(handleChange)
  handleChange()
  return unsubscribe
}

export const DOT = '·'
export const Primes = [3, 5, 7, 11, 13]

const PrimeAngles = Primes.map((p) => 2 * Math.PI * (Math.log2(p) % 1))
const COMMA = 2 * Math.PI * Math.log2(81 / 80)

function makeIntervalEdge (a, b, limitIndex) {
  let angle = b.angle - a.angle
  let [diff, inverted, primeIndex] = Array(limitIndex + 1).fill().map((_, i) => PrimeAngles[i])
    .map((p, i) => [angle - p, angle - (2 * Math.PI - p), i])
    .map(([over, under, i]) => Math.abs(over) < Math.abs(under) ? [over, false, i] : [under, true, i])
    .filter(([diff]) => Math.abs(diff) < COMMA * (1 + 1e-6))
    .reduce(([lowest, inverted, i], [diff, diffInverted, j]) => (
        (lowest == null || Math.abs(diff) < Math.abs(lowest))
        ? [diff, diffInverted, j]
        : [lowest, inverted, i]
      ), []
    )
  if (inverted) {
    [a, b] = [b, a]
  }
  return {
    primeIndex,
    diff: diff / COMMA,
    a: a,
    b: b
  }
}

export function getRatioEdges (ratios, limitIndex) {
  let edges = []
  for (let i = 0; i < ratios.length; i++) {
    for (let j = i + 1; j < ratios.length; j++) {
      let a = ratios[i]
      let b = ratios[j]
      if (a.angle > b.angle) {
        [a, b] = [b, a]
      }
      let edge = makeIntervalEdge(a, b, limitIndex)
      if (edge.primeIndex != null) {
        edges.push(edge)
      }
    }
  }
  return edges
}

export function getActiveRatios (enabledRatioOrders, toggledRatios) {
  let enabledRatios = enabledRatioOrders.reduce((flattened, enabledRatios) => [...flattened, ...enabledRatios])
  return [enabledRatios[0], ...enabledRatios.filter(({json}) => json in toggledRatios)]
}

export function getEnabledRatioOrders (limitIndex, toggledRatios) {
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
  return enabledRatioOrders
}

// removes trailing zeros and turns to string
function factorArrayToJson (factorArray) {
  factorArray = [...factorArray]
  while (factorArray[factorArray.length - 1] === 0) {
    factorArray.pop()
  }
  return JSON.stringify(factorArray)
}

function getComposite (factorArray) {
  return factorArray.map((n, i) =>
      n > 0 ? Math.pow(Primes[i], n) : 1
    )
    .reduce((p, k) => p * k, 1)
}

function renderFactors (factorArray) {
  return factorArray.map((n) => Math.max(n, 0))
    .map((n, i) =>
      Array(n).fill(Primes[i]).join(DOT)
    )
    .filter((s) => s !== '')
    .join(DOT)
}

function makeRatio (factorArray) {
  let num = getComposite(factorArray)
  let dem = getComposite(factorArray.map((n) => -n))
  let octave = -Math.floor(Math.log2(num / dem))
  let ratio = num / dem * Math.pow(2, octave)

  return {
    num, dem, octave, ratio,
    angle: 2 * Math.PI * Math.log2(ratio),
    over: num === 1 ? '1' : renderFactors(factorArray),
    under: dem === 1 ? '1' : renderFactors(factorArray.map((n) => -n)),
    json: factorArrayToJson(factorArray),
    factorArray
  }
}

function getNextRatios (factorArray, n) {
  let over = [...factorArray]
  let under = [...factorArray]
  over[n] += 1
  under[n] -= 1
  return [makeRatio(over), makeRatio(under)]
}

Math.log10 = Math.log10 || function (x) {
  return Math.log(x) / Math.LN10
}
