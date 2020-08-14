<template>
  <Page :title="title"
        ref="_page">
    <template slot="btn">
      <el-dropdown trigger="click">
        <i class="ico ico-more" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="onSendRemind">{{labelText}}</el-dropdown-item>
          <el-dropdown-item @click.native="onExportClick(item)"
                            v-for="(item,key) in exportObj"
                            :key="key"
                            :item="item"
                            :command="item">{{key}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <vx-table :data="table.datas"
              @row-click="onRowClick"
              :height="maxHeight">
      <vx-table-column v-for="(item,i) in table.columns"
                       :label="item"
                       :key="i">
        <template slot-scope="scope">
          <span v-html="scope.row.columns[i]"></span>
        </template>
      </vx-table-column>
    </vx-table>
  </Page>
</template>
<script>
import http from '@/utils/http'
import Api from '@/views/group/report/api'
export default {
  data() {
    return {
      count: 0,
      table: {},
      maxHeight: 100,
      exportObj: {},
      title: ''
    }
  },
  computed: {
    labelText() {
      return `一键催缴（未缴人数：${this.count}）`
    }
  },
  activated() {
    this.title = this.routeQuery('title') || '缴费详情'
    Api.loadReportData({
      appType: '1265',
      noTempletReport: 1,
      groupId: this.routeQuery('groupId'),
      msgId: this.routeQuery('msgId'),
      classId: this.routeQuery('groupId')
    }).then(res => {
      this.table = res.table
      if (res.table.params) {
        this.exportObj = res.table.params.excels
      }
    })
    http
      .post('/business/appPay/getUnPaidNum', {
        appPayUser: {
          msgId: this.routeQuery('msgId'),
          groupId: this.routeQuery('groupId')
        }
      })
      .then(res => {
        this.count = res.unPaidNum || 0
      })
  },
  methods: {
    onExportClick(command) {
      this.openBrowser(command)
    },
    onSendRemind() {
      http
        .post('/business/appPay/sendUnPaidMsg', {
          appPayUser: {
            msgId: this.routeQuery('msgId'),
            groupId: this.routeQuery('groupId')
          }
        })
        .then(res => {
          this.$message({
            type: 'success',
            message: '催缴成功'
          })
        })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.maxHeight = this.$refs._page.sh
    })
  }
}
</script>
