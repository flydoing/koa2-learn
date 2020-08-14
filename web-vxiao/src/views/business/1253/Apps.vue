<template>
  <Page :title="title">
    <label slot="btn"
           @click="onNext">下一步</label>
    <Item v-for="(app,i) in apps"
          :key="i"
          @click="onApp(app)">
      <div slot="before">
        <i :class="prefixCls(app)"></i>
      </div>
      <div>{{app.name}}</div>
    </Item>
  </Page>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapState } from 'vuex'
  export default {
    mixins: [R],
    data() {
      return {
        loading: true,
        apps: []
      }
    },
    computed: {
      ...mapState({
        tokenId: state => state.TOKENID,
        clientId: state => state.CLIENTID
      })
    },
    created() {
      // 如果是教育局，则直接查询教育局大数据下的应用列表
      // 如果是学校，则先查分类
      this.title = this.routeQuery('title') || '模块设置'
      this.get()
    },
    methods: {
      get() {
        Api.loadApps(this.currentGroup.parentId, this.routeQuery('type'))
          .then(res => {
            this.apps = res.bigDataApps || []
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      },
      onApp(app) {
        this.$set(app, 'status', app.status !== '1' ? '1' : 'd')
      },
      prefixCls(app) {
        return [
          `ico ico-select`,
          {
            [`active`]: app.status === '1'
          }
        ]
      },
      onNext() {
        let _apps = this.apps.filter(app => {
          return app.status === '1'
        })
        if (!Check.isRealArray(_apps)) {
          return this.$message({ type: 'warning', message: '请选择需要展示的模块！' })
        }
        this.loading = true
        Api.modifyApps({ bigDataApps: this.apps })
          .then(res => {
            this.get()
            this.loading = false
            this.openBrowser(
              `/papers/bigData/sort?schoolId=${this.currentGroup.parentId}&tokenId=${this.tokenId}&clientId=${this.clientId}&type=${this.routeQuery(
                'remark'
              )}`
            )
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  }
</script>
