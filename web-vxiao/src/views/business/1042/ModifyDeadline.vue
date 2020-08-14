<template>
  <page title="修改"
        @submit="handleSubmit"
        hasSubmit>
    <div class="modify-deadline">
      <item :hasClick="false"
            class="q-time">
        <div slot="main">截止时间</div>
        <div slot="after">
          <el-date-picker v-model="deadline"
                          prefix-icon="x"
                          :clearable="false"
                          type="datetime"
                          placeholder="选择日期时间"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MessageApi from '@/api/message'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        deadline: '',
        message: null
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      fetchData() {
        const that = this
        let msgId = that.routeQuery('msgId')
        MessageApi.getMessageById(msgId).then(res => {
          that.message = res.message
          if (that.message.type === '1042') {
            that.deadline = DateUtils.format(JSON.parse(that.message.msgJson).expirationDate, DateUtils.YMD_HM)
          } else {
            that.deadline = DateUtils.format(JSON.parse(that.message.extensionType).expirationDate, DateUtils.YMD_HM)
          }
        })
      },
      handleSubmit() {
        const that = this

        if (Check.isNullString(that.deadline)) {
          that.$message({ message: '截止时间不能为空', type: 'warning' })
          return false
        }

        that
          .modifyMessage({
            id: that.message.id,
            type: that.message.type,
            extension: DateUtils.format_0800(that.deadline),
            fromUserId: that.message.fromUserId
          })
          .then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          })
      }
    }
  }
</script>
<style lang="scss">
  .modify-deadline {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }
    .q-time input {
      min-width: initial !important;
    }
  }
</style>
