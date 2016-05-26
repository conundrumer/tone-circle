export const DOT = '·'
export const Primes = [3, 5, 7, 11, 13]

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
  enabledRatioOrders.shift()
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

  return {
    num,
    dem,
    octave: -Math.floor(Math.log2(num / dem)),
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
