<template>
  <Page :title="title">
    <CardList :messages="messages"></CardList>
  </Page>
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
  computed: {
    title() {
      return this.messages[0] ? this.messages[0].title : ''
    }
  },
  methods: {
    getMessage() {
      const that = this
      that.msgId = that.routeParam('msgId')
      MessageApi.getMessageById(that.msgId).then(res => {
        that.messages = [res.message]
      })
    }
  },
  mounted() {
    this.getMessage()
  }
}

</script>
