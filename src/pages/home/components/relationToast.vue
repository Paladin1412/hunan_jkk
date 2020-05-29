<template>
    <div class="relation-toast" v-if="toastShow">
        <div class="toast-mask"></div>
        <div class="relation-container">
            <span class="close-icon" @click="popClose">X</span>
            <div class="relation-header">
                <div class="relation-header-title">请完善家庭成员关系</div>
                <div class="relation-header-desc">
                    （管理人会接收所有家庭成员的就医/健康服务通知，可不选）
                </div>
            </div>

            <div class="member-list">
                <div class="member-item" v-for="(item, index) in cardsList" :key="index">
                    <div class="member-item-top">
                        <div class="member-info">
                            <span class="member-info-name">{{ item.name }}</span>
                            <span>{{ item.age }}岁</span>
                        </div>
                        <div class="set-manager" @click="managerChoose(item, index)">
                            <span class="unqualified" v-if="item.unqualified">
                                不符合要求
                            </span>
                            <div v-else class="manager-choose">
                                <img v-if="managerIndex === index" :src="RIGHT_ICON" alt="" />
                                <span v-else class="manager-no-choose"></span>
                                <span class="manager-choose-tips">设为管理人</span>
                            </div>
                        </div>
                    </div>

                    <div class="choose-list">
                        <div
                            class="choose-list-item"
                            :class="item.relation === relationItem.value ? 'relation-active' : ''"
                            v-for="(relationItem, relationIndex) in RELATION_ITEMS"
                            :key="relationIndex"
                            @click="relationChoose(item, index, relationItem)"
                        >
                            {{ relationItem.label }}
                        </div>
                    </div>
                </div>
            </div>

            <div @click="confirm" class="confirm-btn">确认并保存</div>
        </div>
    </div>
</template>

<script>
// import dayjs from 'dayjs'
import { RELATION_ICONS, RELATION_ITEMS, RELATION_OBJ } from '@/utils/globalConst'

const R = require('ramda')

const RIGHT_ICON = 'https://static.wecity.qq.com/lego_next_resources/right-bold-4cacb324bf3b22fa33e8b3c44dca570b.png'

export default {
    mixins: [],
    props: {
        cards: {
            type: Array,
            default: () => [],
        },
    },
    components: {},
    data() {
        return {
            RIGHT_ICON,

            RELATION_ICONS,
            RELATION_ITEMS,
            RELATION_OBJ,

            cardsList: [],

            toastShow: false,

            managerIndex: '',
        }
    },
    computed: {},
    watch: {
        cards(val) {
            this.cardsList = R.clone(val)
        },
    },
    async mounted() {},
    destroyed() {},
    methods: {
        popClose() {
            this.toastShow = false
        },
        popShow() {
            this.toastShow = true
        },
        managerChoose(item, index) {
            console.log('managerChoose', item, index)

            if (item.unqualified) return

            this.managerIndex = this.managerIndex === index ? '' : index
        },
        relationChoose(item, index, relationItem) {
            console.log('relationChoose', item, index, relationItem)
            if (R.contains(relationItem.value, ['0', '3']) && R.find(R.propEq('relation', relationItem.value))(this.cardsList)) {
                this.$weui.topTips(`您已有家庭成员为${RELATION_OBJ[relationItem.value]}关系`)
                return
            }

            let cardsTemp = R.clone(this.cardsList)
            cardsTemp[index].relation = relationItem.value
            this.cardsList = cardsTemp
        },

        confirm() {
            console.log('confirm', this.cardsList)
            this.cardsList = this.cardsList.map((item, index) => ({
                ...item,
                isManager: this.managerIndex === index,
            }))
            this.$emit('relationConfirm', this.cardsList)
            this.popClose()
        },
    },
}
</script>

<style lang="scss" scoped>
.relation-toast {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;

    .toast-mask {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0.4;
        background: #000000;
    }

    .relation-container {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        height: 948px;
        width: 680px;
        background: #ffffff;
        border-radius: 10px;

        .close-icon {
            position: absolute;
            right: 4px;
            font-size: 32px;
            padding: 8px 16px;
            transform: scale(1.3, 1);
            color: #999999;
        }

        .relation-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 40px;

            .relation-header-title {
                font-size: 32px;
                color: #333333;
            }

            .relation-header-desc {
                font-size: 24px;
                color: #999999;
            }
        }

        .member-list {
            margin-top: 30px;
            padding: 0 15px;
            max-height: 680px;
            overflow-y: auto;

            .member-item {
                background: #f7f7f7;
                border-radius: 15px;
                padding: 40px 25px 20px 0;
                box-sizing: border-box;
                margin-bottom: 18px;

                .member-item-top {
                    display: flex;
                    justify-content: space-between;

                    .member-info {
                        border-left: 6px solid #4d88ff;
                        font-size: 24px;
                        color: #333333;
                        padding-left: 31px;
                        height: 30px;
                        line-height: 30px;

                        .member-info-name {
                            font-size: 32px;
                            font-weight: bold;
                            margin-right: 25px;
                        }
                    }

                    .set-manager {
                        font-size: 24px;
                        color: #999999;

                        .manager-choose {
                            display: flex;
                            align-items: center;
                            img {
                                height: 32px;
                                width: 32px;
                            }
                            .manager-no-choose {
                                background: #ffffff;
                                border: 3px solid #4d88ff;
                                border-radius: 50%;
                                height: 32px;
                                width: 32px;
                            }

                            .manager-choose-tips {
                                margin-left: 10px;
                                line-height: 24px;
                            }
                        }
                    }
                }

                .choose-list {
                    display: flex;
                    border-radius: 10px;
                    overflow: hidden;
                    font-size: 24px;
                    color: #333333;
                    height: 60px;
                    background: #fff;
                    margin-top: 45px;
                    margin-left: 25px;
                    border: 1px solid #4d88ff;

                    .choose-list-item {
                        flex: 1;
                        text-align: center;
                        line-height: 60px;
                        border-right: 1px solid #4d88ff;

                        &:last-child {
                            border-right: none;
                        }
                    }

                    .relation-active {
                        background: #4d88ff;
                        color: #fff;
                    }
                }
            }
        }

        .confirm-btn {
            background: #668cff;
            border-radius: 8px;
            width: 650px;
            height: 100px;
            line-height: 100px;
            text-align: center;
            color: #fff;
            font-size: 36px;
            font-weight: bold;
            position: absolute;
            bottom: 14px;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}
</style>
