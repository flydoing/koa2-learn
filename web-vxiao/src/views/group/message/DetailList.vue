<template>
  <Page :title="title"
        @scrollEnd="scrollEnd"
        :showTips="messages.length === 0">
    <Item :hasClick="false"
          fullInput
          slot="top"
          class="search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input placeholder="搜索"
             v-model="keyword" />
    </Item>
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
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
    },
    data() {
      return {
        keyword: '',
        title: ''
      }
    },
    methods: {
      loadMessages() {
        this.getMessages({
          groupId: this.routeQuery('groupId'),
          type: this.routeQuery('appType'),
          keyword: this.keyword,
          queryType: this.keyword !== '' ? 'keyword' : 'type',
          currentPage: this.currentPage
        })
          .then(res => {})
          .catch(res => {})
      }
    },
    mounted() {
      this.title = this.routeQuery('title') || '清单'
      this.loadMessages()
    },
    watch: {
      keyword(v) {
        this.initData()
        this.loadMessages()
        this.$emit('search', v)
      }
    }
  }
</script>
