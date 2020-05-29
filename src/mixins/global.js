import Vue from 'vue'
import dayjs from 'dayjs'

Vue.mixin({
    data() {
        return {
            isIPhone: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        }
    },
    methods: {
        /**
         * 点击事件上报
         */
        clickStat(event, card = {}) {
            console.log('clickStat: ', event, card)

            Vue.prototype.$axios.post('https://txhealthcard.hisdatareport.qq.com/txhealthcard/rest/v1/reportHisData', {
                datas: event.datas || [
                    {
                        qrCodeText: card.qrCodeText,
                        idCardNumber: card.idCard,
                        name: card.name,
                        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        hospitalId: '30069',
                        scene: event.scene,
                        cardType: '11',
                        cardChannel: '0401',
                        department: '',
                        cardCostTypes: '',
                        hospitalCode: '30069',
                        idCard: card.idCard,
                        tag: '',
                    },
                ],
            })
        },

        setBodyFixed() {
            document.body.style.position = 'fixed'
        },
        removeBodyFixed() {
            document.body.style.position = ''
        },
    },
})
