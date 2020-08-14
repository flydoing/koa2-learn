<template>
  <AppPage :title="app.name"
           :showTips="vpads.length === 0 && !isAdmin"
           :loading="loading">
    <label v-if="isAdmin"
           slot="btn"
           @click="onBand">绑定</label>
    <AppCommon :app="curApp" />
    <div class="category-title text"
         v-if="isAdmin">Pad管理</div>
    <Item @click="onWhiteList">
      <div>App白名单</div>
    </Item>
    <Item @click="onInternetList">
      <div>网络访问白名单</div>
    </Item>
    <div class="category-title text"
         v-if="vpads.length>0">共{{vpads.length}}</div>
    <Item v-for="vpad in vpads"
          @click="handle(vpad)"
          :key="vpad.id">
      <div slot="main">{{vpad.code}}</div>
      <div slot="remark">{{vpad.serialNumber}}</div>
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
        vpads: [],
        loading: true
      }
    },
    computed: {
      curApp() {
        return this.currentApp || this.app
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        Api.getVpadsList(this.currentGroup.parentId).then(res => {
          this.loading = false
          this.vpads = res.vpads || []
        })
      },
      handle(vpad) {
        this.routePush({
          name: 'detail1204',
          query: vpad
        })
      },
      onBand() {
        this.routePush({
          name: 'band1204',
          query: {
            schoolId: this.currentGroup.parentId
          }
        })
      },
      onWhiteList() {
        this.routePush({
          name: 'white1204',
          query: {
            schoolId: this.currentGroup.parentId
          }
        })
      },
      onInternetList() {
        this.routePush({
          name: 'internet1204',
          query: {
            schoolId: this.currentGroup.parentId
          }
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
