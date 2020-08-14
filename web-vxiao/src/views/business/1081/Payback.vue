<template>
  <Page title="确认回款"
        closePrompt
        hasSubmit
        @submit="handleSubmit">
    <item :hasClick="false"
          label="回款日期">
      <div slot="after">
        <el-date-picker v-model="time"
                        prefix-icon="x"
                        :clearable="false"
                        type="datetime"
                        placeholder="选择时间"
                        value-format="yyyy-MM-dd HH:mm"
                        format="yyyy-MM-dd HH:mm"></el-date-picker>
      </div>
    </item>
    <item label="回款金额"
          :hasClick="false">
      <input slot="remark"
             placeholder="必填"
             v-model="amount" />
      <div slot="after">元</div>
    </item>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        time: '',
        amount: ''
      }
    },
    created() {},
    computed: {},
    methods: {
      handleSubmit() {
        const that = this
        if (Check.isNullString(this.time)) {
          that.$message({ message: '回款时间不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(this.amount)) {
          that.$message({ message: '回款金额不能为空', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          id: this.routeQuery('msgId'),
          type: '1081',
          groupId: this.groupId,
          msgJson: JSON.stringify({
            backpay: {
              backDate: DateUtils.format_0800(this.time),
              backAmount: this.amount
            }
          })
        })

        that.modifyMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
