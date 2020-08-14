<template>
  <Page :title="title"
        :showTips="messages.length === 0">
    <CardList :messages="messages" />
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R],
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
        return this.routeQuery('title') || ''
      }
    },
    methods: {
      loadMessages() {
        MessageApi.getRestMessage({
          message: {
            groupId: '-1',
            type: '1048',
            userId: this.routeQuery('userId'),
            extension: 'type'
          }
        })
          .then(res => {
            this.messages = res.messages || []
          })
          .catch(res => {})
      }
    },
    mounted() {
      this.loadMessages()
    }
  }
</script>
