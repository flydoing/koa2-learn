<template>
  <el-row :gutter="10"
          class="model-box">
    <el-col :span="4"
            class="model-box-block def"
            @click.native="handleAdmin">
      <label>管理员</label>
      <label class="remark"><i class="ico ico-admin" /></label>
    </el-col>
    <slot>
      <el-col :span="4"
              class="model-box-block def"
              @click.native="handleAppSetup">
        <label>应用设置</label>
        <label class="remark"><i class="ico ico-app-setting" /></label>
      </el-col>
    </slot>
    <template v-if="hasTemplate">
      <!-- <el-col :span="4"
              class="model-box-block def"
              @click.native="handleReportSetup">
        <label>报表</label>
        <label class="remark"><i class="ico ico-app-report" /></label>
      </el-col>
      <el-col :span="4"
              class="model-box-block def"
              @click.native="handleReportSetupAdd">
        <label>新增报表</label>
        <label class="remark"><i class="ico ico-plus" /></label>
      </el-col> -->
    </template>
    <template v-if="hasReport">
      <el-col :span="4"
              class="model-box-block"
              @click.native="handleReport(item)"
              v-for="(item,i) in reportItems"
              :key="i"
              :title="item.name">
        <label>{{item.name}}</label>
        <label class="remark">{{item.description}}</label>
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
    created() {
      // 拉取报表
      ReportApi.loadReportList(this.routeQuery('groupId'), this.app ? this.app.type : this.routeQuery('appType')).then(res => {
        this.reportItems = res.table.items
      })
    },
    methods: {
      handleAdmin() {
        this.routePush({
          path: '/vx/group/business/admin',
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
            name: '1288/reportDetail',
            query: {
              noTempletReport: 1,
              appType: '1288',
              // fromUserId: this.userId,
              // appName: this.message.businessName,
              date: item.params.startDate + '_' + item.params.endDate,
              dateFullName: item.fullName
            }
          })
        }
      },
      handleReportSetup() {
        this.routePush({
          path: '/vx/group/business/report/setup',
          query: {
            groupId: this.routeQuery('groupId'),
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
            groupId: this.routeQuery('groupId'),
            appType: this.app.type
          }
        })
      }
    }
  }
</script>
