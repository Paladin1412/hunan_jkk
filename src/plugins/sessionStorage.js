import Vue from 'vue'

Vue.prototype.$sessionStorage = {
    set(key, val = '') {
        val = JSON.stringify(val)
        sessionStorage.setItem(key, val)
    },
    get(key) {
        let val = sessionStorage.getItem(key)
        val = JSON.parse(val)
        return val
    },
}
