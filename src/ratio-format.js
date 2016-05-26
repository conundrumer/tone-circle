export const COMPOSITE = 'COMPOSITE'
export const FACTORED = 'FACTORED'
export const NO_OCTAVES = 'NO_OCTAVES'

export const ratioFormats = [COMPOSITE, FACTORED, NO_OCTAVES]

export default {
  [COMPOSITE]: {
    label: 'Composite numbers',
    viewFactored: false,
    viewOctaves: false
  },
  [FACTORED]: {
    label: 'Prime factors',
    viewFactored: true,
    viewOctaves: true
  },
  [NO_OCTAVES]: {
    label: 'Prime factors without octaves',
    viewFactored: true,
    viewOctaves: false
  }
}
