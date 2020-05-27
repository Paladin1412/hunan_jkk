import Vue from 'vue'
import Vuex from 'vuex'
import uuid from 'uuid'
const http = Vue.prototype.$http
const cookies = Vue.prototype.$cookies

const commonInEx = {
    ChannelProxyServer: {
        source: 0, // 废字段
        channelNum: 99, // 99为腾讯健康
    },
    HealthCareProxyService: {
        sourceType: '',
        cityCode: '',
    },
}

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        error: null,
        res: {
            getHospitalInfoByEcardNo: null,
        },
        hospitalId: '',
        cityCode: '',
        pageQuery: {},
        reportListItem: {},
    },
    mutations: {
        SET_ERROR(state, error) {
            state.error = error
        },
        SET_RES(state, { api, result }) {
            state.res[api] = result
        },
        SET_PAGE_QUERY(state, pageQuery) {
            state.pageQuery = { ...state.pageQuery, ...pageQuery }
        },
        SET_REPORT_ITEM(state, reportListItem) {
            state.reportListItem = reportListItem
        },
        SET_HOSPITALID(state, hospitalId) {
            state.hospitalId = hospitalId
        },
        SET_CITYCODE(state, cityCode) {
            state.cityCode = cityCode
        },
    },
    actions: {
        async baseGatewayReq(
            ctx,
            { isStore, service, func, req, commonIn = {} }
        ) {
            let result = {}
            let res = {}
            let requestId = uuid()
            try {
                res = await http.post(`/gateway/${service}/${func}`, {
                    args: {
                        commonIn: {
                            requestId,
                            // hospitalId: +ctx.state.hospitalId || '',
                            ...(commonInEx[service] || {}),
                            ...commonIn,
                        },
                        req,
                    },
                    service,
                    func,
                    context: {},
                })
                if (res.code === 0) {
                    const args = res.args || {}
                    const commonOut = args.commonOut || {
                        resultCode: 81010003,
                        errMsg: 'Empty args!',
                    }
                    result = {
                        code: commonOut.resultCode,
                        msg: commonOut.errMsg,
                        data: args.rsp || {},
                    }
                } else {
                    result = {
                        code: 81010002,
                        msg: `网关接口异常[${res.code || '未知错误'}]`,
                    }
                }
            } catch (error) {
                console.error('🍓 GatewayRequest error: ', error)
                result = {
                    code: 81010001,
                    msg: `请检查网络[${error.status || '未知错误'}]`,
                }
            }
            if (isStore && result.code === 0) {
                ctx.commit('SET_RES', {
                    api: `${service}.${func}`,
                    result,
                })
            } else {
                ctx.commit('SET_RES', {
                    api: `${service}.${func}`,
                    result: null,
                })
            }
            console.log('🍓 GatewayRequest: ', service, func, req, result)
            return result
        },
        async GatewayRequest(ctx, { service, func, req, commonIn = {} }) {
            await ctx.dispatch('getKgSet', { req, commonIn })
            return await ctx.dispatch('baseGatewayReq', {
                service,
                func,
                commonIn: {
                    ...commonIn,
                    appId: '',
                    sourceType: 1002,
                },
                req: { ...req, unionFlag: 1 },
            })
        },
        async getKgSet({ state, dispatch, commit }, { req, commonIn }) {
            let hospitalIdIn =
                req.hospitalId || commonIn.hospitalId || state.hospitalId || ''
            if (
                !hospitalIdIn ||
                state.hospitalId !== state.pageQuery.hospitalId ||
                state.hospitalId !== hospitalIdIn
            ) {
                const { code, data = {} } = await dispatch('baseGatewayReq', {
                    service: 'ConfigServer',
                    func: 'getKGSet',
                    req: {
                        hospitalId:
                            +hospitalIdIn || +state.pageQuery.hospitalId || '',
                    },
                })
                commit('SET_HOSPITALID', state.pageQuery.hospitalId)

                console.log(code, data)

                if (code === 0 && data.set) {
                    cookies.set('setName', data.set)
                }
            }
        },
        setPageQuery({ commit }, pageQuery) {
            commit('SET_PAGE_QUERY', pageQuery)
        },
        setCityCode({ commit }, cityCode) {
            commit('SET_CITYCODE', cityCode)
        },
        setReportList({ commit }, reportListItem) {
            commit('SET_REPORT_ITEM', reportListItem)
        },
    },
    modules: {},
})
