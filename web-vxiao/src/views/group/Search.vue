<template>
  <Page :title="title"
        id="_page"
        @scrollEnd="scrollEnd">
    <Item :hasClick="false"
          fullInput
          slot="top"
          class="search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input placeholder="搜索消息"
             v-model="keyword" />
    </Item>
    <template>
      <CardList :messages="messages" />
      <div v-if="hasNextPage===0"
           class="vx-more">没有更多了</div>
    </template>
  </Page>
</template>
<script>
  import { mapGetters } from 'vuex'
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
        loading: false,
        title: '搜索',
        messages: []
      }
    },
    computed: {
      ...mapGetters(['getGroupsBySchoolId'])
    },
    methods: {
      loadMessages() {
        // const that = this
        // const loading = that.$loading({ target: '#_page' })
        let opts = {
          groupId: this.groupId,
          currentPage: this.currentPage
        }
        if (this.isSubjectNetwork) {
          opts.type = '1199'
        }
        if (this.keyword !== '') {
          opts.keyword = this.keyword
          opts.queryType = 'keyword'
        }
        this.getMessages(opts)
          .then(res => {
            // loading.close()
          })
          .catch(res => {
            // loading.close()
          })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.keyword = this.routeQuery('keyword')
        setTimeout(() => {
          this.loadMessages()
        }, 800)
      })
    },
    watch: {
      keyword(v) {
        this.currentPage = 1
        this.messages = []
        this.loadMessages()
      }
    }
  }
</script>
