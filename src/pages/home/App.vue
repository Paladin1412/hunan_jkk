<template>
    <div id="app">
        <error-page v-if="error" :error="error"></error-page>
        <template v-else-if="isAppReady">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive" class="default-page" />
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive" class="default-page" />
        </template>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'App',
    components: {},
    data() {
        return {
            isAppReady: false,
        }
    },
    computed: {
        ...mapState({
            error: state => state.error,
        }),
    },
    mounted() {
        window.loadingToast.close()
        this.isAppReady = true
    },
    methods: {},
}
</script>

<style lang="scss" scoped>
#app {
    height: 100%;
    width: 100%;
}
.default-page :not(input, textarea) {
    user-select: none;
}
</style>
