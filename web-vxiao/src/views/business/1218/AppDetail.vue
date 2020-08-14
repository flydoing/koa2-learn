<template>
  <AppPage :title="app.name"
           :showTips="showTips"
           :loading="loading">
    <label slot="btn"
           @click="batchBand">批量绑定</label>
    <AppCommon :app="curApp" />
    <div v-for="(v,k) in groups"
         :key="k">
      <div class="category-title">{{v.key}}</div>
      <Item v-for="g in v.items"
            :key="g.groupId"
            @click="handle(g)">
        <div>{{g.name}}</div>
      </Item>
    </div>
  </AppPage>
</template>
<script>
  import Api from '@/api/group'
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    props: { app: Object },
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve)
    },
    data() {
      return {
        groups: [],
        showTips: false,
        loading: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      curApp() {
        return this.currentApp || this.app
      }
    },
    methods: {
      fetchData() {
        this.loading = true
        Api.getSchoolAllGroups(this.currentGroup.parentId)
          .then(res => {
            this.groups.push({ key: '班级', items: res.classes })
            this.groups.push({ key: '部门', items: res.groups })
            this.showTips = !Check.isRealArray(res.classes) && !Check.isRealArray(res.groups)
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      },
      handle(g) {
        this.routePush({
          path: '/vx/group/business/1218/setup/users',
          query: {
            name: g.name,
            groupId: g.groupId,
            schoolId: this.currentGroup.parentId
          }
        })
      },
      batchBand() {
        this.routePush({
          path: '/vx/group/business/1218/setup/batch'
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
