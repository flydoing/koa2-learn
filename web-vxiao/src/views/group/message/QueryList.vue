<template>
  <Page :title="title"
        @scrollEnd="scrollEnd"
        :showTips="messages.length === 0">
    <CardList :messages="messages" />
    <div v-if="hasNextPage===0"
         class="vx-more">没有更多了</div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      CardList: (resolve) => require(['@/views/components/card/CardList'], resolve)
    },
    data() {
      return {
        params: {}
      }
    },
    computed: {
      title() {
        return this.routeQuery('title') || '清单'
      }
    },
    methods: {
      loadMessages() {
        let params = this.getStorage('_message_query_params')
        if (params) {
          this.params = params
        }
        this.getMessages({
          ...this.params,
          groupId: this.groupId,
          currentPage: this.currentPage
        })
          .then((res) => {})
          .catch((res) => {})
      }
    },
    mounted() {
      this.loadMessages()
    }
  }
</script>
