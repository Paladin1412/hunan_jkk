import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from '../views/index'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index,
        meta: {
            title: '湖南省居民健康卡',
            keepAlive: false,
        },
    },
]

function getAbsolutePath() {
    let path = location.pathname
    return path.substring(0, path.lastIndexOf('/') + 1)
}

console.log(process.env.NODE_ENV)

const router = new VueRouter({
    mode: 'history',
    base: getAbsolutePath() + `${process.env.NODE_ENV === 'development' ? 'home' : ''}`,
    routes,
})

router.beforeEach((to, from, next) => {
    const title = to.meta.title || '湖南省居民健康卡'
    document.title = title

    const bgColor = to.meta.backgroundColor || '#fff'
    document.querySelector('html').style.backgroundColor = bgColor
    next()
})

router.afterEach(() => {})

export default router
