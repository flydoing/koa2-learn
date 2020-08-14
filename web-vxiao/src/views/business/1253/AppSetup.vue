<template>
  <Setup appType="1253">
    <template slot="btns">
      <label v-if="isEducation"
             @click="onNext">下一步</label>
    </template>
    <template v-if="(isEducation || isSchool) && (isSuperAdmin || isAdmin || isAppAdmin('1253'))"
              slot="others">
      <template v-if="!isEducation">
        <Item v-for="(category,i) in categorys"
              :key="i"
              @click="onCategory(category)">
          <div>{{category.name}}</div>
        </Item>
      </template>
      <template v-else>
        <Item v-for="(app,i) in apps"
              :key="i"
              @click="onApp(app)">
          <div slot="before">
            <i :class="prefixCls(app)"></i>
          </div>
          <div>{{app.name}}</div>
        </Item>
      </template>
    </template>
  </Setup>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapState } from 'vuex'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    data() {
      return {
        loading: true,
        categorys: [],
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
      this.get()
    },
    methods: {
      get() {
        // 如果是教育局，则直接查询教育局大数据下的应用列表
        // 如果是学校，则先查分类
        Api.loadApps(this.currentGroup.parentId, this.isEducation ? 'education' : null)
          .then(res => {
            if (this.isEducation) {
              this.apps = res.bigDataApps || []
            } else {
              this.categorys = res.categorys || []
            }
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      },
      onCategory(category) {
        this.routePush({
          path: '/vx/group/business/1253/apps',
          query: {
            type: category.value,
            title: category.name,
            remark: category.remark
          }
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
            this.openBrowser(`/papers/bigData/sort?schoolId=${this.currentGroup.parentId}&tokenId=${this.tokenId}&clientId=${this.clientId}&type=education`)
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  }
</script>
