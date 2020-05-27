const path = require('path')
const serve = require('koa-static')
const Koa = require('koa')
const app = new Koa()

const host = process.env.IP || '127.0.0.1'
const port = process.env.PORT || 80

const dist = path.join(__dirname, '../dist')
const mount = require('koa-mount')
app.use(serve(dist))

app.use(require('@tencent/emu-access-log')())

app.use(async (context, next) => {
    await next()
})

app.use(mount('/hunan', app))

app.listen(port, host)
