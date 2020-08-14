<template>
  <page title="修订金额"
        @submit="handleSubmit"
        hasSubmit
        :hasClose="false">
    <div class="revise-amount">
      <item :hasClick="false">
        <div slot="main"
             v-html="amountTxt"></div>
        <input slot="remark"
               class="align-right"
               placeholder="金额"
               v-model="amount" />
      </item>
      <TextInput placeholder="修订说明"
                 v-model="content"></TextInput>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import MessageApi from '@/api/message'

  export default {
    mixins: [R],
    data() {
      return {
        content: '',
        amount: '',
        message: {}
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      amountTxt() {
        if (this.message.msgJson) {
          let json = JSON.parse(this.message.msgJson)
          return json ? `原金额（${json.wipedAmount}元）` : ''
        }
        return ''
      }
    },
    methods: {
      fetchData() {
        const that = this
        let msgId = that.routeParam('msgId')
        MessageApi.getMessageById(msgId).then(res => {
          that.message = res.message
        })
      },
      handleSubmit() {
        const that = this
        if (Check.isNullString(that.amount) || isNaN(that.amount) || parseInt(that.amount) < 0) {
          that.$message({ message: '请输入正确的金额', type: 'warning' })
          return false
        }
        if (Check.isNullString(that.content)) {
          that.$message({ message: '修订说明不能为空', type: 'warning' })
          return false
        }
        let postData = {
          id: that.message.id,
          msgJson: JSON.stringify({
            reviseNote: that.content,
            wipedAmount: that.amount
          }),
          type: this.message.type,
          fromUserId: that.userId
        }
        that.modifyMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .revise-amount {
    textarea {
      height: rem(150);
    }
  }
</style>
