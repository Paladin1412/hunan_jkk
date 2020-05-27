import '@/assets/stylesheets/index.scss'
import '../../plugins/index'
import '../../mixins/global'
import App from './App.vue'
import router from './router'
import store from './store'

import BaseApp from '../BaseApp'

class ReportApp extends BaseApp {
    beforeStart() {}
}

const app = new ReportApp({
    router,
    store,
    App,
})
app.start()
