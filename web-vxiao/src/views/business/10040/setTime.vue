<template>
  <Page title="设置时间"
        hasSubmit
        @submit="submit">
    <item :hasClick="false"
          class="dateTime">
      <div>{{title}}</div>
      <div slot="remark">
        <el-date-picker v-model="Time"
                        :clearable="false"
                        type="daterange"
                        range-separator="至"
                        format="yyyy-MM-dd"
                        prefix-icon="xxx"
                        value-format="yyyyMMdd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="center">
        </el-date-picker>
      </div>
    </item>

  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [R],
    data() {
      return {
        title: '',
        Time: [],
        templateId: ''
      }
    },
    created() {
      this.title = this.$route.query.title ? this.$route.query.title : ''
      this.templateId = this.$route.query.templateId ? this.$route.query.templateId : ''
    },
    methods: {
      submit() {
        let query = {
          templateId: this.templateId,
          startDate: this.Time[0],
          endDate: this.Time[1]
        }
        Api.setTemplateTime(query).then(res => {
          if (res.code === '1') {
            this.$message.success('设置时间成功')
            this.routeBack()
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .dateTime {
    .vx-item-right {
      overflow: hidden;
      input {
        text-align: left !important;
      }
      .el-input__inner {
        width: 380px;
        margin-right: -72px;
        border: none !important;
        :nth-last-child(2) {
          text-align: right !important;
        }
      }
      .el-input__icon {
        display: none !important;
      }
    }
  }
</style>
