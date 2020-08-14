<template>
  <Page title="个人分享" @scrollEnd="scrollEnd">
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
        queryType: 'creator',
        userId: this.routeQuery('userId'),
        currentPage: this.currentPage
      }).then(res => {}).catch(res => {})
    }
  },
  mounted() {
    this.loadMessages()
  }
}

</script>
