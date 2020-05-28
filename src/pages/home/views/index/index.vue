<template>
    <div class="container" :class="isGuideShow ? 'container-guide' : ''" @click="containerClick">
        <header>
            <img :src="BACK_PIC" alt="" />
            <div class="header-tips">
                <div class="header-num">{{ visitNum || '--' }}<span class="num-unit">人</span></div>
                <div>正在使用湖南省电子健康卡，就医通行一码通</div>
            </div>
        </header>

        <div class="relation-container">
            <div class="relation-top">
                <div class="relation-list-container">
                    <div class="relation-list" ref="relationListRef">
                        <div class="relation-list-item" v-for="(item, index) in cards" :key="index" :class="activeIndex === index ? 'relation-active' : ''">
                            <img v-if="index !== cards.length" :src="getUserIcon(item.age, item.gender)" alt="" @click="setCardIndex(item, index)" />

                            <span v-if="index !== cards.length" class="relaiont-tips">{{ item.isManager ? '管理者' : RELATION_OBJ[item.relation || ''] || item.name }}</span>
                        </div>
                    </div>

                    <div class="relation-add-item" :class="activeIndex === cards.length ? 'relation-active' : ''">
                        <div class="relation-add" @click="addCard">
                            +
                        </div>

                        <img v-if="isGuideShow" class="add-guide" :class="cards.length === 0 ? 'no-card-add-img' : ''" :src="ADD_GUIDE" alt="" />
                    </div>
                </div>

                <div class="reltaion-situation" @click="toRelationManager">
                    <div class="reltaion-situation-info">
                        <span>
                            家庭成员管理
                            <!-- <span class="situation-value">低</span> -->
                        </span>
                    </div>

                    <img src="https://static.wecity.qq.com/lego_next_resources/right-arrow-f8153a713e1de9c513e36da456ea5626.png" alt="" />
                </div>
            </div>
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item, index) in cards" :key="index">
                        <div class="swiper-info" @click="cardClick(item)">
                            <img class="card-back" :src="CARD_HUNAN" alt="" />
                            <div class="card-name">{{ item.name }}</div>
                            <div class="card-id">{{ item.idNumber }}</div>
                            <div class="qrcode" ref="qrcodeRef">
                                <img class="qrcode-logo" :src="LOGO" alt="" />
                                <img class="qrcode-img" :src="item.qrcodeImg" alt="" />
                                <!-- <canvas :id="`qrcode_${index}`"></canvas> -->
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide">
                        <div class="swiper-info add-card-swiper" @click="addCard">
                            <img class="card-back card-add" :src="CARD_BACK" alt="" />
                            <div class="add-card-container">
                                <img class="add-card-icon" :src="ADD_ICON" alt="" />
                                <div class="add-card-tips">
                                    点“+”申领电子健康卡
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        </div>

        <div class="main-container">
            <div v-for="(moduleItem, moduleIndex) in moduleConfig" :key="moduleIndex">
                <div v-if="moduleItem.type === 'iconTop'" class="recommond-menu">
                    <div class="recommond-menu-item" v-for="(item, index) in moduleItem.data" :key="index" @click="commonClick($event, item, moduleItem.backColor)">
                        <img :src="item.icon" alt="" />
                        <div>{{ item.label }}</div>
                    </div>
                </div>

                <div class="general-menu" v-else>
                    <div class="general-menu-title">{{ moduleItem.title }}</div>
                    <div class="general-menu-container">
                        <div
                            class="general-menu-item"
                            v-for="(item, index) in moduleItem.data"
                            :key="index"
                            :class="moduleItem.type === 'withoutIcon' ? 'kepu-menu-item' : ''"
                            :style="{
                                background: moduleItem.backColor || 'transparent',
                            }"
                            @click="commonClick($event, item, moduleItem.backColor)"
                        >
                            <img v-if="item.icon" :src="item.icon" alt="" />
                            <div class="general-menu-info">
                                <div
                                    class="general-menu-label"
                                    :style="{
                                        color: moduleItem.color || '#333',
                                    }"
                                >
                                    {{ item.label }}
                                </div>
                                <div v-if="item.desc">{{ item.desc }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <footer>湖南省卫生健康委员会主办</footer>

        <relationToast :cards="cards" @relationConfirm="relationConfirm" />

        <div class="home-guide" v-if="isGuideShow">
            <div class="guide-mask"></div>
            <div class="guide-container">
                <img class="manage-guide" :src="MANAGE_GUIDE" alt="" />
            </div>
        </div>
    </div>
</template>

<script>
import relationToast from '../../components/relationToast'

import dayjs from 'dayjs'
import Swiper from 'swiper'
import QRCode from 'qrcode'
import { getUserIcon, RELATION_OBJ, KEPU_MENU, CUSTOMER_MENU, RECOMOND_MENU, HEALTH_TOOLS, YLJL_URL, BASE_URL, HOSPITAL_ID, TECENT_URL, APP_ID } from '@/utils/globalConst'
import { CARD_LIST_MOCK } from '@/mock/cardData'

const R = require('ramda')

const BACK_PIC = 'https://static.wecity.qq.com/lego_next_resources/changsha-back-f82d630b60662455276d7fb1fe610274.png'
const CARD_BACK = 'https://static.wecity.qq.com/lego_next_resources/card-back-f3a5b9722293f01244e10da183ba20cb.png'
const CARD_HUNAN = 'https://static.wecity.qq.com/lego_next_resources/swiper-hunan-5ab0b1f0d96196e60937b6cd436aa738.png'
const ADD_ICON = 'https://yiliao-1254237151.cos.ap-shanghai.myqcloud.com/wxa/cardNew/add-icon.png'
const LOGO = 'https://static.wecity.qq.com/lego_next_resources/logo-b18dcf7bf55c412ec04989061d0512ad.png'
const MANAGE_GUIDE = 'https://static.wecity.qq.com/lego_next_resources/manager-guide-3a2829686415003d16fd60853ddfdb74.png'
const ADD_GUIDE = 'https://static.wecity.qq.com/lego_next_resources/add-guide-048f331cfd8446fa73c3d39341bafef1.png'

const COLOR = ['#000', '#256A0A', '#F39119', '#E02020']

export default {
    name: 'Index',
    mixins: [],
    components: { relationToast },
    data() {
        const isGuideShow = ~~localStorage.isGuideShow !== 1

        return {
            BACK_PIC,
            CARD_BACK,
            CARD_HUNAN,
            ADD_ICON,
            MANAGE_GUIDE,
            ADD_GUIDE,
            LOGO,
            RELATION_OBJ,
            isGuideShow,
            visitNum: '',

            activeIndex: 0,
            swiper: null,
            timer: null,

            cards: [],

            moduleConfig: {},

            recomendMenu: RECOMOND_MENU,
            coustomerMenu: CUSTOMER_MENU,
            kepuMenu: KEPU_MENU,
            healthTools: HEALTH_TOOLS,
        }
    },
    computed: {},
    watch: {},
    async beforeCreate() {
        const pathName = process.env.NODE_ENV === 'production' ? `${location.pathname || ''}` : ''

        const { status, data } = await this.$axios.get(`${pathName}moduleConfig.json`)

        console.log('moduleConfig', status, data)
        if (status === 200 && data) {
            this.moduleConfig = Object.values(data || [])
        }
    },
    async mounted() {
        const wechatCode = this.$route.query.wechatCode || localStorage.wechatCode

        if (!wechatCode) {
            location.href = `https://health.tengmed.com/open/getUserCode?appId=${APP_ID}&hospitalId=${HOSPITAL_ID}&redirect_uri=${encodeURIComponent(location.href)}`
            return
        }
        localStorage.wechatCode = wechatCode

        if (process.env.NODE_ENV !== 'production') {
            this.cards = CARD_LIST_MOCK
        }

        this.initPage()
    },
    destroyed() {},
    methods: {
        getUserIcon,
        async initPage() {
            this.initSwiper()
            if (process.env.NODE_ENV === 'production' && !(await this.initCardList())) return

            this.initQrcode()
            this.getNum()

            try {
                this.clickStat({ scene: '0101088' }, this.cards[0] || {})
                this.clickStat({
                    datas: this.cards.map(item => ({
                        qrCodeText: item.qrCodeText,
                        idCardNumber: item.idCard,
                        name: item.name,
                        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        hospitalId: HOSPITAL_ID,
                        scene: '02010184',
                        cardType: '11',
                        cardChannel: '0401',
                        department: '',
                        cardCostTypes: '',
                        hospitalCode: HOSPITAL_ID,
                        idCard: item.idCard,
                        tag: '',
                    })),
                })
            } catch (error) {
                console.log('clickStat error: ', error)
            }
        },
        containerClick() {
            this.isGuideShow = false
            localStorage.isGuideShow = 1
        },
        async getNum() {
            try {
                const { errno, data } = await this.$axios.jsonp(`https://jkkyljl.hnhfpc.gov.cn/httpapi/services.ashx?ACTION=rysuzi`)

                if (errno === 0 && data && data.userCount) {
                    this.visitNum = `${(data.userCount || '').toFixed(2)}`.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,').split('.')[0] || ''

                    console.log('getNum success: ', data)
                }
            } catch (error) {
                console.log('getNum error: ', error)
            }
        },
        async initCardList() {
            const token = this.$cookies.get('token') || ''
            console.log('home_token: ', token)

            if (token == '' || token == null || typeof token == 'undefined') {
                window.location.href =
                    'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5c5ee20cde3b70e7&redirect_uri=https%3a%2f%2fjkkgzh.hnhfpc.gov.cn%2fjkk%2fopenid.aspx&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
                return false
            }

            const payload = decodeURIComponent(escape(window.atob(token.split('.')[1])))
            const openId = JSON.parse(payload).openid

            console.log('openId', openId)

            try {
                const res = (await this.$axios.get(`${BASE_URL}/jkk/Handler.ashx?action=list&Openid=${openId}`)) || {}

                if (res.status === 200 && res.data.errno === 0) {
                    this.cards = res.data.data || []
                }
                console.log('Handler: ', res.data)
            } catch (error) {
                console.log('Handler error: ', error)
                this.cards = []
            }

            return true
        },
        initSwiper() {
            const self = this

            this.swiper = new Swiper('.swiper-container', {
                direction: 'horizontal', // 垂直切换选项
                loop: false, // 循环模式选项
                centeredSlides: true,
                width: window.innerWidth * 0.8,
                // initialSlide: localStorage.cardIndex  || 0,
                spaceBetween: window.innerWidth * 0.06,
                slidesOffsetBefore: window.innerWidth * 0.05,
                observer: true, //修改swiper自己或子元素时，自动初始化swiper
                observeParents: true, //修改swiper的父元素时，自动初始化swiper
                // 如果需要分页器
                // pagination: {
                //     clickable: true,
                //     el: '.swiper-pagination',
                //     bulletClass: 'my-bullet',
                //     bulletActiveClass: 'my-bullet-active',
                // },
                on: {
                    slideChange: function slideChange() {
                        console.log('card slide change: ', this.activeIndex)

                        if (this.activeIndex === self.activeIndex) return
                        self.activeIndex = this.activeIndex || 0
                        localStorage.cardIndex = this.activeIndex

                        if (this.activeIndex >= 4) {
                            self.$refs.relationListRef.scrollLeft = (self.$refs.relationListRef.clientWidth / 7) * this.activeIndex
                        } else {
                            self.$refs.relationListRef.scrollLeft = 0
                        }
                    },
                },
            })
        },

        initSwiperIndex() {
            if (this.activeIndex >= this.cards.length) {
                this.activeIndex = 0
                localStorage.cardIndex = 0
            }

            this.$nextTick(() => {
                setTimeout(() => {
                    this.swiper.slideTo(localStorage.cardIndex || 0, 0, false)
                }, 100)
            })
        },

        initQrcode() {
            this.$nextTick(async () => {
                let cardsTemp = []
                const len = this.cards.length
                for (let index = 0; index < len; index++) {
                    const item = this.cards[index]
                    try {
                        const qrcodeImg = await QRCode.toDataURL(item.qrCodeText, {
                            errorCorrectionLevel: 'M',
                            color: {
                                dark: COLOR[+item.colour] || COLOR[0],
                                light: '#fff',
                            },
                        })

                        cardsTemp.push({
                            ...item,
                            qrcodeImg,
                            age: item.idCard ? dayjs().diff(item.idCard.substr(6, 8), 'year') : '--',
                        })
                    } catch (error) {
                        console.log('QRCode error: ', error)
                        cardsTemp.push(item)
                    }
                }
                this.cards = R.sortBy(R.prop('relation'))(cardsTemp)

                this.initSwiperIndex()
            })
        },
        setCardIndex(item, index) {
            console.log('setCardIndex: ', index)

            this.swiper.slideTo(index, 800, false)
            this.activeIndex = index
        },
        cardClick(item) {
            const { name, idCard, phone, colour, t, qrCodeText } = item
            location.href = `${BASE_URL}/jkk/personal.html?name=${name}&idCard=${idCard}&phone=${phone}&colour=${colour}&t=${t}&qrCodeText=${qrCodeText}`
        },

        addCard() {
            // if (this.cards.length >= 10) {
            //     this.$weui.topTips('微信绑卡数量已达上限，请先解绑其他健康卡')
            //     return
            // }
            location.href = 'https://jkkzc.hnhfpc.gov.cn/gzc/Wx_jmjkk/regist.html'
        },

        dealBeforeClick(e, item, color) {
            console.log('dealBeforeClick', item)

            if (e.currentTarget.className.includes('item')) {
                e.currentTarget.style.backgroundColor = '#ddd'
                const currentTarget = e.currentTarget

                this.timer && clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    currentTarget.style.backgroundColor = color || 'transparent'
                }, 100)
            }

            this.clickStat({ scene: item.scene }, this.cards[this.activeIndex] || {}, '1')

            if (this.cards.length === 0 || this.activeIndex === this.cards.length) {
                this.addCard()
                return false
            }

            if (!item.url && !item.moudleId) {
                this.$weui.toast('即将开通')
                return false
            }

            const card = this.cards[this.activeIndex] || {}
            if (+card.rpc !== 1 && +item.isrpc == 1) {
                this.$weui.toast('未完成人脸识别，请完成人脸注册')
                location.href = `${BASE_URL}/jkk/wx_rlrz.html?name=${card.name}&idNumber=${card.idCard}`
                return false
            }

            this.clickStat({ scene: item.scene }, this.cards[this.activeIndex] || {})

            return true
        },

        commonClick(e, item, color) {
            if (!this.dealBeforeClick(e, item, color || '')) return

            if (!item.moudleId) {
                this.itemClick(e, item)
            } else {
                this.itemClickWithMoudleId(e, item)
            }
        },

        itemClick(e, item) {
            const card = this.cards[this.activeIndex] || {}

            location.href = item.url
                .replace('HealthCode=', `HealthCode=${card.healthCardId}`)
                .replace('sfz=', `sfz=${card.idCard}`)
                .replace('ecardNo=', `ecardNo=${card.healthCardId}`)
                .replace('healthCardId=', `healthCardId=${card.healthCardId}`)
        },

        async itemClickWithMoudleId(e, item) {
            const loading = this.$weui.loading('加载中...')

            try {
                const card = this.cards[this.activeIndex] || {}
                console.log('itemClickWithMoudleId: ', card.healthCardId)

                const getUrl = `${YLJL_URL}/httpapi/services.ashx?ACTION=kpzs&HealthCode=${card.healthCardId}&moduleId=${item.moudleId}`

                const { data, errno, message } = await this.$axios.jsonp(getUrl)

                if (errno === 0 && data && data.orderId) {
                    location.href = `https://health.tengmed.com/h5/open/checkOrderId?orderId=${data.orderId}`
                    loading.hide()
                } else {
                    this.$weui.topTips(message)
                }
            } catch (error) {
                loading.hide()
                this.$weui.topTips(error)
            }
        },
        relationConfirm(cardsList) {
            console.log('relationConfirm', cardsList)
            this.cards = cardsList
        },
        toRelationManager() {
            location.href = `${TECENT_URL}/h5/report/memberManage?cityCode=430000&hospitalId=${HOSPITAL_ID}`
        },
    },
}
</script>

<style>
@import '../../../../assets/stylesheets/swiper.min.css';
.swiper-pagination {
    margin-top: 20px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0 !important;
}

.my-bullet {
    width: 10px;
    height: 10px;
    background: #a7c4ff;
    border-radius: 50%;
    margin-right: 10px;
}

.my-bullet-active {
    width: 40px;
    height: 10px;
    background: #4d88ff;
    border-radius: 10px;
}
</style>

<style lang="scss" scoped>
.ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.container {
    position: relative;
    background: #f8f8f8;
    padding-bottom: 30px;

    header {
        position: relative;

        img {
            position: absolute;
            top: 0;
            height: 284px;
            width: 100%;
        }

        .header-tips {
            position: absolute;
            top: 83px;
            left: 20px;
            font-size: 24px;

            .header-num {
                font-size: 40px;
                min-height: 40px;
            }

            .num-unit {
                font-size: 20px;
                margin-left: 20px;
            }
        }
    }

    .relation-container {
        margin: 0 20px;
        width: calc(100% - 40px);
        position: absolute;
        top: 203px;
        background: #ffffff;
        border-radius: 15px;
        padding: 0 0 27px 0;

        .relation-list-container {
            flex: 1;
            display: flex;
            align-items: center;
            padding-right: 8px;
        }

        .relation-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 20px;
            color: #333333;
            padding-left: 20px;
            margin-bottom: 4px;
        }

        .relation-list {
            display: flex;
            align-items: flex-start;
            max-width: 370px;
            height: 130px;
            padding-top: 14px;
            overflow-x: auto;
            overflow-y: hidden;

            &::-webkit-scrollbar {
                display: none;
            }

            .relation-list-item {
                margin-right: 20px;
                position: relative;
                margin-top: 10px;

                &:last-child {
                    margin-right: 0;
                    padding-right: 10px;

                    .relaiont-tips {
                        padding-right: 14px;
                    }
                }

                img {
                    height: 50px;
                    width: 50px;
                    border-radius: 50%;
                    transition: all 0.14s ease-in;
                }

                .relaiont-tips {
                    font-size: 24px;
                    color: #999;
                    position: absolute;
                    left: 50%;
                    transform: scale(0.6) translateX(-82%);
                    white-space: nowrap;
                    bottom: -24px;
                    display: inline-block;
                    text-align: center;
                }
            }

            .relation-active {
                position: relative;
                margin-top: 0;
                .relation-add {
                    line-height: 60px;
                }

                img,
                .relation-add {
                    height: 70px;
                    width: 70px;
                    margin-bottom: 0;
                    border: 1px solid #4d88ff;
                    color: #4d88ff;
                }
            }
        }

        .relation-add-item {
            margin: -2px 0 0 10px;
            position: relative;

            .relation-add {
                height: 50px;
                width: 50px;
                border-radius: 50%;
                border: 1px solid #b3b3b3;
                text-align: center;
                line-height: 46px;
                color: #b3b3b3;
                font-size: 30px;
                margin-bottom: 20px;
                box-sizing: border-box;
            }
        }

        .relation-active {
            position: relative;
            margin-top: 0;
            .relation-add {
                line-height: 60px !important;
            }

            img,
            .relation-add {
                height: 70px;
                width: 70px;
                margin-bottom: 0;
                border: 1px solid #4d88ff;
                color: #4d88ff;
            }
            .relation-add {
                line-height: 70px;
                font-size: 34px;
            }
            &::after {
                position: absolute;
                content: '';
                border-top: solid 9px #4d88ff;
                border-left: solid 6px #00800000;
                border-right: solid 6px #00800000;
                border-bottom: solid 0px #00800000;
                position: absolute;
                left: 30px;
                top: 96px;
            }

            .relaiont-tips {
                color: #4d88ff !important;
            }
        }

        .relation-add-item {
            &.relation-active {
                margin-bottom: 30px;
            }
        }

        .reltaion-situation {
            display: flex;
            align-items: center;

            .reltaion-situation-info {
                background: #dceacc;
                border-radius: 25px;
                height: 50px;
                line-height: 50px;
                padding: 0 20px;
                font-size: 20px;

                .situation-value {
                    font-size: 24px;
                    color: #73ba43;
                    display: inline-block;
                    margin-left: 10px;
                    font-weight: bold;
                }
            }

            img {
                height: 48px;
                width: 48px;
            }
        }

        .swiper-container {
            width: calc(100% - 10px);
            height: 360px;

            .swiper-slide {
                position: relative;

                .add-card-swiper {
                    // background: #aaa;
                    border-radius: 2.4%;
                }
                .swiper-info {
                    width: 620px !important;
                    height: 360px;
                    .card-back {
                        width: 100%;
                        height: 100%;
                    }

                    .card-add {
                        opacity: 0.5;
                    }

                    .add-card-container {
                        position: absolute;
                        top: 50%;
                        left: 52%;
                        transform: translate(-50%, -50%);
                        font-size: 30px;
                        font-weight: bold;
                        display: flex;
                        flex-direction: column;
                        align-items: center;

                        img {
                            height: 80px;
                            width: 80px;
                            margin-bottom: 20px;
                        }

                        .add-card-tips {
                            white-space: nowrap;
                        }
                    }

                    .card-name {
                        position: absolute;
                        top: 192px;
                        left: 35px;
                        font-weight: bold;
                        font-size: 46px;
                        color: #2b2b2b;
                    }

                    .card-id {
                        position: absolute;
                        top: 255px;
                        left: 35px;
                        font-weight: bold;
                        font-size: 30px;
                        color: #2b2b2b;
                    }

                    .qrcode {
                        width: 163px;
                        height: 163px;
                        background: #fafcff;
                        position: absolute;
                        left: 433px;
                        top: 125px;
                        overflow: hidden;

                        img {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }

                        .qrcode-logo {
                            width: 39px;
                            height: 38px;
                            z-index: 10;
                        }

                        .qrcode-img {
                            // top: 50.1%;
                            // left: 50.1%;
                            height: 191px;
                            width: 191px;
                            // margin-left: 1px;
                            // margin-top: 1px;
                        }
                    }
                }
            }
        }
    }

    .main-container {
        padding: 0 20px;
        padding-top: 720px;
        width: 100%;
        box-sizing: border-box;

        .recommond-menu {
            background: #ffffff;
            border-radius: 15px;
            margin-top: 22px;
            font-size: 28px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 14px 40px;

            .recommond-menu-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px;
                border-radius: 2px;

                img {
                    height: 56px;
                    width: 56px;
                    margin-bottom: 10px;
                }
            }
        }

        .general-menu {
            border-radius: 15px;
            background: #fff;
            margin-top: 20px;
            padding-top: 28px;

            .general-menu-title {
                font-size: 32px;
                font-weight: bold;
                border-left: 8px solid #4d88ff;
                line-height: 29px;
                padding-left: 26px;
                margin-bottom: 30px;
            }

            .general-menu-container {
                display: flex;
                flex-wrap: wrap;

                .general-menu-item {
                    width: 50%;
                    font-size: 24px;
                    color: #b3b3b3;
                    padding: 35px 31px;
                    padding-right: 14px;
                    border: 1px solid #f8f8f8;
                    display: flex;
                    align-items: center;

                    .general-menu-label {
                        font-size: 28px;
                        color: #333333;
                    }

                    img {
                        height: 48px;
                        width: 48px;
                        margin-right: 24px;
                    }
                }

                .kepu-menu-item {
                    width: 325px;
                    height: 90px;
                    line-height: 90px;
                    border-radius: 7px;
                    margin-left: 20px;
                    margin-bottom: 20px;
                    padding: 0;

                    .general-menu-info {
                        width: 100%;
                        font-size: 28px;
                        text-align: center;

                        .general-menu-label {
                            color: #147f77;
                            width: 100%;
                        }
                    }
                }
            }
        }
    }

    footer {
        font-size: 28px;
        color: #888;
        text-align: center;
        margin: 50px 0;
    }
}

.container-guide {
    overflow: hidden;
    height: 100%;
}

.home-guide {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;

    .guide-mask {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0.4;
        background: #000000;
    }

    .manage-guide {
        position: fixed;
        height: 140px;
        right: 10px;
        top: 240px;
    }
}

.add-guide {
    position: absolute;
    z-index: 200;

    height: 140px !important;
    width: auto !important;
    border: none !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -26%);

    &.no-card-add-img {
        top: 64%;
    }
}
</style>
