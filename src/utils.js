// removes trailing zeros and turns to string
export function factorArrayToJson (factorArray) {
  factorArray = [...factorArray]
  while (factorArray[factorArray.length - 1] === 0) {
    factorArray.pop()
  }
  return JSON.stringify(factorArray)
}
