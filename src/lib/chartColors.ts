export const CHART_PALETTE = {
  gold:           { dark: '#C49440', light: '#9E6C2E' },
  blue:           { dark: '#64AFED', light: '#2B6BB1' },
  vibrantGreen:   { dark: '#47D183', light: '#1B7E46' },
  darkPurple:     { dark: '#9477C5', light: '#4F3181' },
  electricPurple: { dark: '#EB70DA', light: '#D025B9' },
} as const

export type ChartColorName = keyof typeof CHART_PALETTE

const DEFAULT_KEYS = Object.keys(CHART_PALETTE) as ChartColorName[]

export function resolveSeriesColors(chartColors: string[], theme: 'dark' | 'light'): string[] {
  const keys = chartColors.length > 0 ? chartColors : DEFAULT_KEYS
  return keys.map((k, i) => {
    const entry = CHART_PALETTE[k as ChartColorName]
    return entry ? entry[theme] : CHART_PALETTE[DEFAULT_KEYS[i % DEFAULT_KEYS.length]][theme]
  })
}
