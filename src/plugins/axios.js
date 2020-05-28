/* eslint-disable prettier/prettier */
'use strict'

import Vue from 'vue'
import axios from 'axios'
import uuid from 'uuid/v4'
import { HOSPITAL_ID } from '@/utils/globalConst'

const config = {
    baseURL: '/',
    timeout: 15 * 1000, // Timeout
    withCredentials: true, // Check cross-site Access-Control
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
    function(config) {
        // Do something before request is sent
        const requestId = uuid()
        config.__custom__ = {
            startTime: Date.now(),
            traceId: config.traceId || requestId,
            requestId,
            hospitalId: HOSPITAL_ID,
        }

        return config
    },
    function(error) {
        console.error(error)

        // Do something with request error
        return Promise.reject(error)
    },
)

// Add a response interceptor
_axios.interceptors.response.use(
    function(response) {
        return Promise.resolve(response)
    },
    function(error) {
        return Promise.reject(error)
    },
)

Plugin.install = function(Vue) {
    _axios.$get = _axios.get
    _axios.$post = _axios.post
    _axios.jsonp = url => {
        if (!url) {
            console.error('Axios.JSONP 至少需要一个url参数!')
            return
        }
        return new Promise(resolve => {
            window.jsonCallBack = result => {
                resolve(result)
            }
            var JSONP = document.createElement('script')
            JSONP.type = 'text/javascript'
            JSONP.src = `${url}&callback=jsonCallBack`
            document.getElementsByTagName('head')[0].appendChild(JSONP)
            setTimeout(() => {
                document.getElementsByTagName('head')[0].removeChild(JSONP)
            }, 500)
        })
    }

    _axios.setHeader = function(key, val) {
        _axios.defaults.headers.common[key] = val
    }

    Vue.axios = _axios
    window.axios = _axios
    Object.defineProperties(Vue.prototype, {
        axios: {
            get() {
                return _axios
            },
        },
        $axios: {
            get() {
                return _axios
            },
        },
    })
}

Vue.use(Plugin)

export default Plugin
