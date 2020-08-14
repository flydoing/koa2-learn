<template>
  <AppPage title="管理"
           :hasAdd="isOrg"
           @add="add"
           ref="_page">
    <AppCommon :app="curApp"
               :hasReport="false"
               :hasTemplate="false" />
    <div class="category-title"></div>
    <template v-if="isOrg">
      <Tabs theme="theme-1"
            v-if="spaces.length > 0">
        <TabPane v-for="space in spaces"
                 :key="space.category.id"
                 :label="space.category.name"
                 :name="space.category.id"
                 :currentData="space">
          <div class="category-title text">数量：{{space.screens ? space.screens.length : 0}}</div>
          <Scroller :height="sh">
            <Item style="background:#F8F8F8;"
                  @click="setup(space.category)">
              <div>设置</div>
            </Item>
            <Item v-for="screen in space.screens"
                  :key="screen.id"
                  @click="detail(screen)">
              <div>{{screen.placeName}} {{screen.serialNumber}}</div>
              <div slot="remark"
                   :class="{'error':screen.extension==='0'}">
                {{screen.extension === '0' ? '异常' : '正常'}}
              </div>
            </Item>
          </Scroller>
        </TabPane>
      </Tabs>
    </template>
  </AppPage>
</template>
<script>
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import R from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [R],
    props: { app: Object },
    components: {
      Tabs,
      TabPane,
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve)
    },
    data() {
      return {
        spaces: [],
        sh: ''
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
        Api.getScreensBySchoolId(this.currentGroup.parentId).then(res => {
          this.spaces = res.spaces || []
        })
      },
      add() {
        this.routePush({
          path: '/vx/group/business/1246/setup/add',
          query: { schoolId: this.currentGroup.parentId }
        })
      },
      setup(category) {
        this.routePush({
          path: '/vx/group/business/1246/setup/manager',
          query: {
            name: category.name,
            id: category.id
          }
        })
      },
      detail(screen) {
        this.routePush({
          path: '/vx/group/business/1246/setup/detail',
          query: {
            id: screen.id,
            placeName: screen.placeName,
            serialNumber: screen.serialNumber,
            extension: screen.extension,
            categoryName: screen.categoryName
          }
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.sh = this.innerHeight - 125 - 90 - 52 - 30 - 30
      })
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
