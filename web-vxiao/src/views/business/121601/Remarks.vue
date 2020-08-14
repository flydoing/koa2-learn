<template>
  <Page title="备注"
        @scrollEnd="scrollEnd"
        :showTips="messages.length === 0">
    <CardList :messages="messages"></CardList>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
    },
    data() {
      return {}
    },
    methods: {
      loadMessages() {
        this.getMessages({
          groupId: this.currentGroup.groupId,
          type: '121602',
          queryType: 'category',
          categoryId: this.routeQuery('cId'),
          extension: this.routeParam('msgId'),
          currentPage: this.currentPage
        })
          .then(res => {})
          .catch(res => {})
      }
    },
    mounted() {
      this.loadMessages()
    }
  }
</script>
