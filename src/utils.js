// http://stackoverflow.com/a/27696695/2573317
export const Base64 = (() => {
  let digitsStr =
// 0       8       16      24      32      40      48      56     63
// v       v       v       v       v       v       v       v      v
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_-abcdefghijklmnopqrstuvwxyz"
  let digits = digitsStr.split('')
  let digitsMap = {}
  for (let i = 0; i < digits.length; i++) {
    digitsMap[digits[i]] = i
  }
  return {
    fromInt (int32) {
      if (int32 < 0) {
        int32 += 64
      }
      if (!(int32 in digits)) {
        throw new RangeError()
      }
      return digits[int32]
    },
    toInt (digitsStr) {
      if (!(digitsStr in digitsMap)) {
        throw new RangeError()
      }
      return digitsMap[digitsStr]
    }
  }
})()

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
const MAX_ORDER = 64 / 2 - 1

const PrimeAngles = Primes.map((p) => 2 * Math.PI * (Math.log2(p) % 1))
const PrimeTolerances = [26, 42, 20, 15, 10].map(t => t * 2 * Math.PI / 1200)

function makeIntervalEdge (a, b, limitIndex) {
  let angle = b.angle - a.angle
  let [diff, inverted, primeIndex] = Array(limitIndex + 1).fill().map((_, i) => PrimeAngles[i])
    .map((p, i) => [angle - p, angle - (2 * Math.PI - p), i])
    .map(([over, under, i]) => Math.abs(over) < Math.abs(under) ? [over, false, i] : [under, true, i])
    .filter(([diff, _, i]) => Math.abs(diff) < PrimeTolerances[i])
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
    diff: diff,
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
  for (let i = 0; i < enabledRatioOrders.length && i < MAX_ORDER - 1; i++) {
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

function removeTrailingZeros (array) {
  array = [...array]
  while (array[array.length - 1] === 0) {
    array.pop()
  }
  return array
}

function factorArrayToJson (factorArray) {
  return JSON.stringify(removeTrailingZeros(factorArray))
}

function getComposite (factorArray) {
  return factorArray.map((n, i) =>
      n > 0 ? Math.pow(Primes[i], n) : 1
    )
    .reduce((p, k) => p * k, 1)
}

function makeRatio (factorArray) {
  let num = getComposite(factorArray)
  let dem = getComposite(factorArray.map((n) => -n))
  let octave = -Math.floor(Math.log2(num / dem))
  let ratio = num / dem * Math.pow(2, octave)

  return {
    num, dem, octave, ratio,
    angle: 2 * Math.PI * Math.log2(ratio),
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
