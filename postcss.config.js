module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-url': {},
        'postcss-cssnext': {
            browsers: ['> 1%', 'iOS >= 8', 'Android >= 4.1'],
        },
        'postcss-preset-env': {},
        'postcss-px-to-viewport': {
            viewportWidth: 750,
            viewportHeight: 1334,
            unitPrecision: 3,
            viewportUnit: 'vw',
            selectorBlackList: ['.skipvw'],
            minPixelValue: 1,
            mediaQuery: false,
        },
        'postcss-viewport-units': {},
        cssnano: {
            preset: 'default',
        },
    },
}
