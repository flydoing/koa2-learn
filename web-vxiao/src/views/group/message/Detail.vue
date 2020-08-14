<template>
  <Page title="消息详情">
    <CardList :messages="messages" />
  </Page>
</template>
<script>
  import Api from '@/api/message'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [MixinMessage],
    components: {
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
    },
    created() {
      Api.getMessageById(this.routeQuery('id')).then(res => {
        if (res.message) {
          let appType = '1011~1016'
          if (res.message && appType.indexOf(res.message.type) >= 0) {
            this.routeReplace({
              name: 'cardDetail',
              params: { msgId: res.message.id },
              query: { type: res.message.type }
            })
          } else {
            this.messages = [res.message]
          }
        } else {
          this.$message({ type: 'warning', message: '该消息已被删除' })
          this.routeBack()
        }
      })
    }
  }
</script>
