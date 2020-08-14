<template>
  <page title="会议纪要">
    <CardList :messages="messages"></CardList>
  </page>
</template>
<script>
import CardMixin from '@/views/components/card/mixin'
import MessageApi from '@/api/message'

export default {
  mixins: [CardMixin],
  components: {
    CardList: resolve => require(['@/views/components/card/CardList'], resolve)
  },
  data() {
    return {
      messages: []
    }
  },
  computed: {},
  methods: {
    getMessage() {
      const that = this
      let msgId = that.routeParam('msgId')
      if (msgId) {
        MessageApi.getMessageById(msgId).then(res => {
          that.messages = [res.message]
        })
      }
    }
  },
  mounted() {
    this.getMessage()
  }
}

</script>
