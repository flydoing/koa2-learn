<template>
  <AppPage :title="app.name"
           :showTips="vPosList.length===0"
           :loading="loading"
           @add="add"
           hasAdd>
    <AppCommon :app="curApp" />
    <div v-for="c in vPosList"
         :key="c.categoryId">
      <div class="category-title">{{c.categoryName}}（{{c.count}}）</div>
      <Item v-for="vPos in c.vPos"
            :key="vPos.id"
            @click="handle(vPos,c)">
        <div>{{vPos.name}}</div>
        <div slot="remark"
             :class="{'error':vPos.isOnline==='0'}">{{vPos.code}}</div>
      </Item>
    </div>
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
        vPosList: [],
        loading: false
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
        this.loading = true
        Api.getvPosList(this.currentGroup.parentId)
          .then(res => {
            this.vPosList = res.posCategories || []
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      },
      add() {
        this.routePush({
          path: '/vx/group/business/1226/setup/add',
          query: {
            schoolId: this.currentGroup.parentId
          }
        })
      },
      handle(vPos) {
        this.setStorage('_cache_vPos', vPos)
        this.routePush({
          path: '/vx/group/business/1226/setup/detail',
          query: {
            schoolId: this.currentGroup.parentId,
            id: vPos.id
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
