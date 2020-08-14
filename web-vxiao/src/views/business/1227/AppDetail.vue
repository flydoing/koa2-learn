<template>
  <AppPage :title="app.name"
           :showTips="vBoxList.length===0"
           :loading="loading"
           :hasAdd="true"
           @add="plus">
    <AppCommon :app="curApp" />
    <div v-for="c in vBoxList"
         :key="c.categoryId">
      <div class="category-title">{{c.typeName}}（{{c.count}}）</div>
      <Item v-for="vBox in c.vBoxes"
            :key="vBox.id"
            @click="handle(vBox,c)">
        <div>{{vBox.name}}</div>
        <div slot="remark"
             :class="{'error':vBox.isOnline==='0'}">{{vBox.serialNumber}}</div>
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
        vBoxList: [],
        loading: false
      }
    },
    computed: {
      curApp() {
        return this.currentApp || this.app
      }
    },
    methods: {
      fetchData() {
        this.loading = true
        Api.getvBoxList(this.currentGroup.parentId)
          .then(res => {
            this.vBoxList = res.typeVBoxes
            this.loading = false
          })
          .catch(res => {
            this.loading = false
          })
      },
      plus() {
        this.routePush({
          path: '/vx/group/business/1227/setup/add',
          query: {
            schoolId: this.currentGroup.parentId
          }
        })
      },
      handle(vBox) {
        this.routePush({
          path: '/vx/group/business/1227/setup/detail',
          query: {
            schoolId: this.currentGroup.parentId,
            id: vBox.id
          }
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.fetchData()
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
