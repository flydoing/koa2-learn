<template>
  <el-row :gutter="10"
          class="model-box">
    <el-col :span="3"
            class="model-box-block def"
            @click.native="handleAdmin"
            v-if="power">
      <div>
        <label>管理员</label>
        <label class="remark"><i class="ico ico-admin" /></label>
      </div>
    </el-col>
    <slot>
      <el-col :span="3"
              class="model-box-block def"
              @click.native="handleAppSetup"
              v-if="power">
        <div>
          <label>应用设置</label>
          <label class="remark"><i class="ico ico-app-setting" /></label>
        </div>
      </el-col>
    </slot>
    <template v-if="hasReport">
      <el-col :span="3"
              class="model-box-block"
              @click.native="handleReport(item)"
              v-for="(item,i) in reportItems"
              :key="i"
              :title="item.name">
        <div>
          <label>{{item.name}}</label>
          <label class="remark">{{item.description}}</label>
        </div>
      </el-col>
    </template>
  </el-row>
</template>
<script>
  import ReportApi from '@/views/group/report/api'
  import R from '../mixin'
  export default {
    mixins: [R],
    props: {
      app: Object,
      overWriteReportItem: Boolean,
      hasTemplate: { tupe: Boolean, default: true },
      hasReport: { tupe: Boolean, default: true }
    },
    data() {
      return { reportItems: [] }
    },
    computed: {
      power() {
        return this.isSuperAdmin || this.isAdmin || this.isAppAdmin(this.app.type)
      }
    },
    created() {
      this.loadReportItems()
    },
    methods: {
      loadReportItems() {
        // 拉取报表
        ReportApi.loadReportList(this.groupId, this.routeQuery('appType') || this.app.type).then(res => {
          this.reportItems = res.table.items || []
        })
      },
      handleAdmin() {
        this.routePush({
          path: '/vx/group/business/app/admin',
          query: {
            appType: this.app.type
          }
        })
      },
      handleReport(item) {
        if (this.overWriteReportItem) {
          this.$emit('report', item)
        } else {
          this.setStorage('_report_detail_refresh', true)
          this.routePush({
            name: 'reportDetail',
            params: {
              groupId: this.groupId
            },
            query: {
              appType: this.app.type,
              fromUserId: this.userId,
              appName: this.app.name,
              ...item.params
            }
          })
        }
      },
      handleReportSetup() {
        this.setStorage('_business_show_report_template_setup', this.hasTemplate)
        this.routePush({
          path: '/vx/group/business/report/setup',
          query: {
            groupId: this.groupId,
            appType: this.app.type
          }
        })
      },
      handleReportSetupAdd() {
        this.routePush({
          name: 'reportTemplateList',
          query: this.$route.query
        })
      },
      handleAppSetup() {
        this.routePush({
          path: '/vx/group/business/app/setup',
          query: {
            groupId: this.groupId,
            appType: this.app.type
          }
        })
      }
    },
    watch: {
      currentApp(v) {
        this.loadReportItems()
      }
    }
  }
</script>
