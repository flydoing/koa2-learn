<template>
  <Page title="招投标" @scrollEnd="scrollEnd">
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
          parentId: this.routeParam('msgId'),
          type: '1206',
          queryType: 'parentId',
          currentPage: this.currentPage
        }).then(res => {}).catch(res => {})
      }
    },
    mounted() {
      this.loadMessages()
    }
  }

</script>
