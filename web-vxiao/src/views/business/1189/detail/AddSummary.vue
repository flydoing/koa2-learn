<template>
  <page title="总结" :hasSubmit="!disabledBol" @submit="commitSummary">
    <TextInput placeholder="总结内容" :max="500" v-model="inputStr" />
  </page>
</template>
<script>
  import Api from '../api'
  import MsgApi from '@/api/message'
  import CardMixin from '@/views/components/card/mixin'
  import R from '@/views/business/mixin'
  export default {
    mixins: [CardMixin, R],
    data() {
      return {
        datas: [],
        inputStr: ''
      }
    },
    components: {
      TextInput: resolve => require(['@/components/TextInput'], resolve)      
    },
    created() {
      this.routeQuery('isSummarized') ? this.disabledBol = true : this.disabledBol = false
      Api.getSummaryConten(this.currentGroup.groupId, this.routeQuery('userId'), this.routeQuery('season')).then(res => {
        this.datas = res.datas
        this.datas && this.datas.forEach((d, i) => {
          this.inputStr = `${this.inputStr}${this.inputStr ? '\n' : ''}${d.content}`
        })
      })
    },
    methods: {
      commitSummary() {
        MsgApi.addMessage({
          type: '1191',
          groupId: this.currentGroup.groupId,
          content: `{\\@\\${this.routeQuery('userName')}\\${this.routeQuery('userId')}\\}`,
          notify: [this.routeQuery('userId')],
          msgJson: JSON.stringify({
            userId: this.routeQuery('userId'),
            content: this.inputStr
          }),
          ...this.commonMessage()
        }).then(res => {
          this.routeBack()
        })
      }
    }
  }

</script>
