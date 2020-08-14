<template>
  <AppPage :title="app.name"
           :showTips="vvrs.length===0"
           :loading="loading"
           @add="add"
           :hasAdd="true">
    <AppCommon :app="curApp" />
    <Item v-for="(vvr,i) in vvrs"
          @click="handle(vvr)"
          :key="i">
      <div>{{vvr.name}} {{vvr.serialNumber}}</div>
      <div slot="remark">
        <template v-if="vvr.status===1">正常</template>
        <template v-else><span class="text-color error">异常</span></template>
      </div>
    </Item>
  </AppPage>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    props: { app: Object },
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve)
    },
    data() {
      return {
        vvrs: [],
        loading: false
      }
    },
    computed: {
      curApp() {
        return this.currentApp || this.app
      }
    },
    created() {},
    methods: {
      fetchData() {
        this.loading = true
        Api.getVVRList(this.currentGroup.parentId)
          .then(res => {
            this.vvrs = res.vvrs
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      },
      add() {
        this.routePush({
          path: '/vx/group/business/1229/setup/add',
          query: { schoolId: this.currentGroup.parentId }
        })
      },
      handle(vvr) {
        this.setStorage('_cache_vvr', vvr)
        this.routePush({
          path: '/vx/group/business/1229/setup/detail'
        })
      }
    },
    watch: {
      currentApp(v) {
        this.fetchData()
      },
      $route(to, from) {
        if (to.path === '/vx/') {
          this.fetchData()
        }
      }
    }
  }
</script>
