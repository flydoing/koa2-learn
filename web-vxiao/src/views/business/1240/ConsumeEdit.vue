<template>
  <page title="多扣退款"
        @submit="handleSubmit"
        hasSubmit>
    <item :hasClick="false"
          label="实际消费"
          :remark="actual">
    </item>
    <item :hasClick="false"
          label="实际应扣">
      <div slot="after">
        <input placeholder="输入金额"
               v-model="amount"
               @keyup="handleChange" />
      </div>
    </item>
    <item :hasClick="false"
          label="多扣退款"
          :remark="result">
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    data() {
      return {
        actual: '',
        amount: '',
        result: ''
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      fetchData() {
        let amount = parseInt(this.routeQuery('amount') || 0)
        if (amount < 0) {
          this.actual = amount - amount * 2
        }
      },
      handleChange() {
        if (Check.isNumber(this.amount)) {
          this.result = this.actual - this.amount
        }
      },
      handleSubmit() {
        const that = this
        let params = that.$route.query
        let amount = this.amount
        if (Check.isNullString(amount)) {
          that.$message({ message: '请输入实际应扣金额', type: 'warning' })
          return false
        }
        if (amount < 0 || amount > that.actual) {
          that.$message({ message: '实际应扣金额不正确', type: 'warning' })
          return false
        }
        this.$confirm('确认退款？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let actual = parseFloat(this.routeQuery('amount') || 0)
          if (actual < 0) {
            amount = amount - amount * 2
          }

          Api.modifyConsume({
            vcardDetails: [
              {
                id: params.id,
                schoolId: that.currentGroup.parentId,
                amount: amount
              }
            ]
          }).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          })
        })
      }
    }
  }
</script>
