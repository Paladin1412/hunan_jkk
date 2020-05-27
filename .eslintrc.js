module.exports = {
    root: true,

    env: {
        node: true,
    },
    extends: ['plugin:vue/strongly-recommended', '@vue/prettier'],
    rules: {
        'no-console': 'off',
        'no-debugger': 'off',
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                trailingComma: 'es5',
                tabWidth: 4,
                semi: false,
            },
        ],
        'vue/prop-name-casing': ['off', 'camelCase' | 'snake_case'],
    },

    parserOptions: {
        parser: 'babel-eslint',
    },
}
