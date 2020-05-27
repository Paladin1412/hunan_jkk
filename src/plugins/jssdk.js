import Vue from 'vue'
import wx from 'weixin-js-sdk'

let isValid = false
const isIPhone = !!navigator.userAgent.match(/(iPhone)/)
const isMiniProgram = !!navigator.userAgent.match(/(miniProgram)/)
const isUseEntryUrl = isIPhone || isMiniProgram
window.ENTRY_URL = location.href

/**
 * @description 单页应用调用wx.config
 * @iOS_H5 一次config，使用H5入口页面url（replace路由后要再次config，须更换为新的入口url签名）(resetEntryUrl有效性待确认)
 * @iOS_小程序webview 一次config，使用webview入口页面url（replace路由后要再次config，须更换为新的入口url签名）
 * @Android_H5 每次重新config，使用当前页面url
 * @Android_小程序webview 每次重新config，使用webview入口页面url
 */

Vue.prototype.$initWxConfig = async (isUseCurrentUrl = false) => {
    let url = location.href
    if (isUseEntryUrl) {
        url = window.ENTRY_URL
    }
    if (location.href.indexOf('resetEntryUrl=1') >= 0 && isIPhone) {
        // iOS在用了replace后再config的话，必须更换签名url
        url = location.href
    }
    if (isValid && isIPhone) {
        // 紧苹果可缓存
        return wx
    }
    if (isUseCurrentUrl) {
        url = location.href
    }
    if (isUseCurrentUrl) {
        url = location.href
    }
    console.log('🍓 initWxConfig url', url)
    const params = {
        url: url.split('#')[0],
        appId: process.env.COMMON_CONFIG.jssdkAppId,
    }
    const result = await Vue.prototype.$axios.$get('/com/open/getWxConfig', {
        params,
    })
    const jsApiList = [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onVoiceRecordEnd',
        'playVoice',
        'onVoicePlayEnd',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getLocalImgData',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard',
        'updateAppMessageShareData',
        'updateTimelineShareData',
    ]
    if (wx && result.retcode === 0) {
        const data = result.data
        wx.config({
            debug: false,
            beta: true,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList,
        })
        await new Promise((resolve, reject) => {
            wx.ready(res => {
                console.log('wx config ready', res)
                isValid = true
                resolve(res)
            })
            wx.error(err => {
                console.log('wx config error', err)
                reject(err)
            })
        })
    }
    if (isMiniProgram) {
        jsApiList.forEach(el => {
            const miniJsApiList = [
                'checkJSApi',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getLocalImgData',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'onVoicePlayEnd',
                'uploadVoice',
                'downloadVoice',
                'translateVoice',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'startSearchBeacons',
                'stopSearchBeacons',
                'onSearchBeacons',
                'scanQRCode',
                'chooseCard',
                'addCard',
                'openCard',
            ]
            if (miniJsApiList.indexOf(el) < 0) {
                wx[el] = (func => {
                    return () => {
                        console.log('🍌 小程序无该api权限:', func)
                    }
                })(el)
            }
        })
    }
    if (isMiniProgram) {
        wx.hideOptionMenu = () => {}
    }
    console.log('🍓 initWxConfig: ', url, wx)
    return wx || {}
}
