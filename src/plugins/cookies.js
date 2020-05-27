import JSCookie from 'js-cookie'
import Vue from 'vue'

Vue.prototype.$cookies = {
    get(...args) {
        return JSCookie.get(...args)
    },
    set(...args) {
        JSCookie.set(...args)
    },
    remove(...args) {
        JSCookie.remove(...args)
    },
}
