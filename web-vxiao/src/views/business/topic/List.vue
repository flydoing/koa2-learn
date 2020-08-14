<template>
  <Page :title="title" @scrollEnd="scrollEnd">
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
      return {
        title: ''
      }
    },
    methods: {
      loadMessages() {
        const title = this.routeQuery('label')
        this.getMessages({
          groupId: this.currentGroup.groupId,
          keyword: title,
          queryType: 'tagging',
          currentPage: this.currentPage
        }).then(res => {
        }).catch(res => {})
      }
    },
    mounted() {
      this.loadMessages()
    }
  }

</script>
