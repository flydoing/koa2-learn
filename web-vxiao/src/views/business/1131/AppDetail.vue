<template>
  <AppPage :title="app.name"
           :showTips="groups.length===0"
           :loading="loading">
    <template slot="btn">
      <label @click="handleImportRecode">导入消费记录</label>
      <label @click="batch">批量新增</label>
    </template>
    <AppCommon :app="curApp" />
    <div class="category-title"></div>
    <Item @click="evaluation">
      <div>评比卡</div>
    </Item>
    <div class="category-title"></div>
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
        Api.getGroupsVCards(this.groupId)
          .then(res => {
            this.groups = res.groups || []
            this.loading = false
          })
          .catch(res => {
            this.loading = false
          })
      },
      handle(g) {
        this.routePush({
          path: '/vx/group/business/1131/setup/detail',
          query: {
            title: g.name,
            groupId: g.groupId,
            schoolId: this.currentGroup.parentId
          }
        })
      },
      batch() {
        this.routePush({
          path: '/vx/group/business/1131/setup/batch'
        })
      },
      evaluation() {
        this.routePush({
          path: '/vx/group/business/1131/setup/evaluation',
          query: {
            groupId: this.groupId,
            schoolId: this.currentGroup.parentId
          }
        })
      },
      handleImportRecode() {
        let that = this
        that.$import({
          title: '导入消费记录',
          uploadURI: this.uploadURL,
          templateUrl: '/static/template/consumption.xlsx',
          receiptUrl: `/business/vcard/import/detail/${that.currentGroup.parentId}?`,
          callback: (res, file) => {
            that.$message({ type: 'success', message: '导入成功' })
          },
          receiptBack: (res, file) => {
            if (res.commonTable) {
              let lines = []
              res.commonTable.lines.map((l, i) => {
                lines.push(l.slice(0, 6))
              })
              that.setStorage('_import_receipt', {
                headers: res.commonTable.headers,
                lines: lines
              })
              that.routePush({
                path: '/vx/group/import/receipt',
                query: {
                  uri: `/business/vcard/import/detail/${that.currentGroup.parentId}`,
                  fileId: res.fileId
                }
              })
            }
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
