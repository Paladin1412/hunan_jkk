import { throttle, addClass, removeClass } from '@/utils'

function getScrollEventHandler() {
    const initHeight = window.innerHeight // 无导航栏的高度
    return throttle(
        () => {
            const footer = this.$refs['fixed-footer']
            if (!footer) return
            if (window.innerHeight >= initHeight) {
                this.isShowBottomPadding = true
                addClass(footer, 'iphonex-bottom-padding')
            } else {
                this.isShowBottomPadding = false
                removeClass(footer, 'iphonex-bottom-padding')
            }
        },
        50,
        50
    )
}

export default {
    data() {
        return {
            wx: null,
            isShowBottomPadding: false,
            handleScrollEvent: () => {},
        }
    },
    async mounted() {
        this.pageStat()

        this.$log.reportPageShowLog({
            pageId: this.$route.name,
            extra: {},
        })

        this.wx = null
        this.$initWxConfig()
            .then(wx => {
                this.wx = wx
                wx.hideOptionMenu()
            })
            .catch(err => {
                console.error(err)
            })

        this.handleScrollEvent = getScrollEventHandler.call(this)
    },
    beforeDestroy() {
        this.$log.reportPageHideLog({
            pageId: this.$route.name,
            extra: {},
        })
    },
    updated() {
        this.handleScrollEvent()
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            window.addEventListener('scroll', vm.handleScrollEvent)
        })
    },
    beforeRouteLeave(to, from, next) {
        this.removeBodyFixed()
        window.removeEventListener('scroll', this.handleScrollEvent)
        next()
    },
    methods: {},
}
