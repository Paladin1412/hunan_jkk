import Vue from 'vue'

export default class BaseApp {
    constructor(options) {
        this.options = options
    }

    async start() {
        await this.beforeStart()

        Vue.config.productionTip = false

        Vue.config.errorHandler = function(err, vm, info) {
            console.error('Vue errorHandler:', err, info)
        }

        const { router, store, App } = this.options
        new Vue({
            router,
            store,
            render: h => h(App),
        }).$mount('#app')

        await this.afterStart()
    }
    beforeStart() {}
    afterStart() {}
}
