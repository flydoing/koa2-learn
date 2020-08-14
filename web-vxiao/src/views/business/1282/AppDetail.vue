<template>
  <AppPage :title="app.name"
           :showTips="roadgates.length === 0"
           :loading="loading"
           hasAdd
           @add="onAdd">
    <AppCommon :app="curApp" />
    <template v-if="roadgates.length > 0">
      <div class="category-title">数量{{count}}</div>
      <div v-for="(p,i) in roadgates"
           :key="i">
        <Item remark="设置"
              v-if="isAdmin"
              style="background:#F8F8F8;"
              :label="p.categroyName"
              @click="onSetup(p)">
          <div>设置</div>
        </Item>
        <Item v-for="r in p.vRoadGates"
              :key="r.id"
              :label="r.name"
              @click="onClick(r)">
          <template slot="remark">
            <div slot="remark"
                 :class="{'error':r.errCount >= 1}">
              {{r.errCount === 0 ? '正常2' : r.errCount === 2 ? '异常2' : '正常1、异常1'}}
            </div>
          </template>
        </Item>
      </div>
    </template>
  </AppPage>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [R],
    props: { app: Object },
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve)
    },
    data() {
      return {
        count: 0,
        roadgates: [],
        loading: false
      }
    },
    computed: {
      curApp() {
        return this.currentApp || this.app
      }
    },
    created() {
      this.loading = true
      Api.getRoadgates(this.schoolId).then(res => {
        this.loading = false
        this.count = res.count
        this.roadgates = res.vRoadGateCategoryList || []
      })
    },
    methods: {
      onSetup(p) {
        this.routePush({
          path: '/vx/group/business/1282/setup',
          query: {
            categoryId: p.categoryId
          }
        })
      },
      onClick(r) {
        this.setStorage('_cache_roadgate', r)
        this.routePush({
          path: '/vx/group/business/1282/detail',
          query: {
            title: r.name
          }
        })
      },
      onAdd() {
        this.routePush({
          path: '/vx/group/business/1282/add'
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
