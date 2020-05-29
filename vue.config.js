const path = require('path')
const glob = require('glob')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin')

const isDev = process.env.npm_lifecycle_event === 'serve'

const pages = {}
glob.sync('./src/pages/**/app.js').forEach(filePath => {
    let chunk = filePath.split('./src/pages/')[1].split('/app.js')[0]
    chunk = chunk.replace(/(?!^)([A-Z])/g, '-$1').toLowerCase()
    let template = 'public/index.html'
    if (['feiyan'].includes(chunk)) {
        template = `public/template/${chunk}.html`
    }
    pages[chunk] = {
        entry: filePath,
        template,
    }
})

const publicPath = '/hunan/'

const externals = {
    'weixin-js-sdk': 'wx',
    'weui.js': 'weui',
}
if (!isDev) {
    externals.vue = 'Vue' // 本地调试时不能用外链，否则vue devtool不生效
}

module.exports = {
    pages,
    crossorigin: 'anonymous',
    publicPath,
    transpileDependencies: [
        'vue-echarts',
        'resize-detector',
        // '@tencent/healthcard-h5-log-util',
    ],
    css: {
        extract: false,
        loaderOptions: {
            scss: {
                prependData: `
                    @import "@/assets/stylesheets/variables/_variables.scss";
                    @import "@/assets/stylesheets/mixins/_index.scss";
                `,
            },
        },
    },
    configureWebpack: {
        resolve: {
            alias: {
                styles: path.resolve(path.join(__dirname, 'wap'), 'src/assets/styles'),
            },
        },
        externals,
        plugins: [
            new HtmlWebpackTagsPlugin({
                scripts: [],
                usePublicPath: false,
            }),
            new ScriptExtHtmlWebpackPlugin({
                custom: [
                    {
                        test: /\.js$/,
                        attribute: 'onload',
                        value: 'onScriptLoad(this)',
                    },
                ],
            }),
        ],
    },
    devServer: {
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://healtht.tengmed.com/',
                changeOrigin: true, // target是域名的话，需要这个参数，
                secure: false, // 设置支持https协议的代理
                pathRewrite: {
                    // 路径重写，
                    '^/api': '',
                },
                bypass: function(req) {
                    const accept = req.headers.accept
                    if (accept && accept.indexOf('html') !== -1) {
                        const result = req.path.match(/\/hunan\/([a-zA-Z_\-0-9]+)/)
                        if (result) {
                            return `/${result[1]}.html`
                        }
                    }
                },
            },
        },
    },
    chainWebpack: config => {
        config.plugin('define').tap(args => {
            console.log(args[0]['process.env'])
            return args
        })
    },
}
