const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./src/**/*.vue'],
  theme: {
    extend: {
      zIndex: {
        '-1': '-1',
      },
      colors: {},
    },
    spacing: {
      ...generatePx(),
      ...generateRpx(),
      ...generatePercentage(),
      full: '100%',
      '2-full': '200%',
      auto: 'auto',
      fit: 'fit-content',
      min: 'min-content',
      max: 'max-content',
    },
    fontSize: theme => theme('spacing'),
    borderWidth: theme => theme('spacing'),
    borderRadius: theme => ({ ...theme('spacing'), full: '9999px' }),
    lineHeight: theme => theme('spacing'),
    translate: theme => theme('spacing'),
    inset: theme => theme('spacing'),
    width: theme => ({ ...theme('spacing'), screen: '100vw' }),
    minWidth: theme => theme('width'),
    maxWidth: theme => theme('width'),
    height: theme => ({ ...theme('width'), screen: '100vh' }),
    minHeight: theme => theme('height'),
    maxHeight: theme => theme('height'),
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    plugin(({ addComponents }) => {
      addComponents({
        '.s-transition': {
          transition: 'all 200ms ease-in-out',
        },
        '.s-shadow': {
          boxShadow: '12px 12px 24px 0px rgba(225, 230, 243, 0.7)',
        },
        '.s-shadow-md': {
          boxShadow: '6px 6px 12px 0px rgba(225, 230, 243, 0.7)',
        },
        '.btn': {
          display: 'inline-block',
          margin: '16rpx',
          padding: '10rpx',
          borderRadius: '999px',
          textAlign: 'center',
          cursor: 'pointer',
        },
      })
    }),
  ],
  corePlugins: {
    preflight: false,
  },
}

/** (0...999 as i) -> (i)px */
function generatePx() {
  const result = {}
  for (let i = 0; i < 1000; i++) {
    result[i] = `${i}px`
  }
  return result
}

/** (0...999 as i)r -> (i * 2)rpx */
function generateRpx() {
  const result = {}
  for (let i = 0; i < 1000; i++) {
    result[`${i}r`] = `${i * 2}rpx`
  }
  return result
}

/** (1...n as i)/(2,3,4,5,6,12 as n) -> calc(100% * i / n) */
function generatePercentage() {
  const result = {}
  for (const n of [2, 3, 4, 5, 6, 12]) {
    for (let i = 1; i < n; i++) {
      result[`${i}/${n}`] = `calc(100% * ${i} / ${n})`
    }
  }
  return result
}
