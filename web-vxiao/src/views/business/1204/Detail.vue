<template>
  <Page :loading="loading"
        @scrollEnd="scrollEnd">
    <item>
      <div slot="main">设备名称</div>
      <div slot="after">{{vpad.code}}</div>
    </item>
    <item>
      <div slot="main">硬件序列号</div>
      <div slot="after">{{vpad.serialNumber}}</div>
    </item>
    <div class="list-button">
      <el-button type="danger"
                 icon="el-icon-delete"
                 size="medium"
                 @click="unband">解绑</el-button>
    </div>
    <div class="category-title">使用日志</div>
    <item v-for="(item,i) in history"
          :key="i">
      <div slot="main">{{startTime}}</div>
      <div slot="after">{{endTime}}</div>
    </item>
  </Page>
</template>
<script>
  import Api from './api'
  import DateUtils from '@/utils/date'
  export default {
    data() {
      return {
        vpad: {},
        history: [],
        startTime: '',
        endTime: '',
        loading: true,
        page: 1
      }
    },
    created() {
      this.vpad = this.$route.query
      // 查询日志接口
      this.fetchData()
    },
    methods: {
      scrollEnd() {
        // vpad 添加加载数据逻辑
        this.loading = true
        this.page = this.page + 1
        Api.usageRecord(this.vpad.serialNumber, this.page)
          .then(res => {
            // 这里是逻辑处理
            this.history.push(res.useRecords)
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      },
      fetchData() {
        Api.usageRecord(this.vpad.serialNumber)
          .then(res => {
            this.history = res.useRecords
            this.startTime = DateUtils.format(res.useRecords.startTime, 'yyyy-MM-dd hh:mm')
            this.endTime = DateUtils.format(res.useRecords.endTime, 'yyyy-MM-dd hh:mm')
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      },
      unband() {
        Api.saveVpad({
          vpads: [
            {
              ...this.vpad,
              status: 'd'
            }
          ]
        }).then(res => {
          this.$message({
            type: 'success',
            message: '解绑成功'
          })
          this.routeBack(-1)
        })
      }
    }
  }
</script>
