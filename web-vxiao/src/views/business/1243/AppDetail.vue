<template>
  <AppPage :title="app.name"
        :showTips="groups.length===0"
        :loading="loading">
    <label slot="btn"
           @click="batch">批量新增</label>
    <AppCommon :app="curApp" />
    <div class="category-title"
         v-if="groups.length>0"></div>
    <Item v-for="g in groups"
          @click="handle(g)"
          :key="g.groupId">
      <div>{{g.name}}</div>
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
        groups: [],
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
      Api.getGroupsVCards(this.currentGroup.groupId)
        .then(res => {
          this.groups = res.groups || []
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      },
      handle(g) {
        this.routePush({
          path: '/vx/group/business/1243/setup/detail',
          query: {
            title: g.name,
            groupId: g.groupId,
            schoolId: this.currentGroup.parentId
          }
        })
      },
      batch() {
        this.routePush({
          path: '/vx/group/business/1243/setup/batch'
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
