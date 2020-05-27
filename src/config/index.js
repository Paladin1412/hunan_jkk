const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const config = (() => {
    console.log('config file loading.....')
    let config = {}
    fs.readdirSync(__dirname)
        .filter(f => f.endsWith('.js'))
        .forEach(f => {
            let _config = require(__dirname + '/' + f)
            config = Object.assign({}, config, _config)
        })

    let env = process.env.NODE_ENV || 'production'
    const npm_lifecycle_event = process.env.npm_lifecycle_event
    if (npm_lifecycle_event && npm_lifecycle_event.split(':')[1]) {
        // 通过构建脚本进来
        env = npm_lifecycle_event.split(':')[1]
    }

    console.log('merge config from', env)
    let fpath = path.normalize(__dirname + '/env/' + env + '.js')
    if (fs.existsSync(fpath)) {
        let _config = require(fpath)
        config = _.merge({}, config, _config)
    }

    fpath = path.normalize(__dirname + '/env/' + env)

    fs.existsSync(fpath) &&
        fs
            .readdirSync(fpath)
            .filter(f => f.endsWith('.js'))
            .forEach(f => {
                let _config = require(fpath + '/' + f)
                config = _.merge({}, config, _config)
            })
    return config
})()

module.exports = config
