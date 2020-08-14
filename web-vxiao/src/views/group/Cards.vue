<template>
  <scroller :height="sh"
            id="_cards"
            class="vx-main-cards"
            :class="{'show-tips':messages.length <= 0}"
            @scrollEnd="scrollEnd">
    <!-- <Item :hasClick="false"
          class="full-input">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input slot="main"
             placeholder="搜索消息"
             v-model="keyword" />
    </Item> -->
    <CardRemind />
    <template v-if="messages.length>0">
      <CardList :messages="messages" />
      <div v-if="hasNextPage===0"
           class="vx-more">没有更多了</div>
    </template>
    <div class="vx-model-tips"
         v-else>
      <slot name="tips">
        <img src="/static/ico/icon_commoneuse.png" />
        <span>暂无内容</span>
      </slot>
    </div>
  </scroller>
</template>
<script>
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      CardList: resolve => require(['@/views/components/card/CardList'], resolve),
      CardRemind: resolve => require(['@/views/components/card/CardRemind'], resolve)
    },
    data() {
      return {
        keyword: ''
      }
    },
    computed: {
      sh() {
        return this.innerHeight - 75 - 40 - 10
      }
    },
    methods: {
      loadMessages() {
        const that = this
        const loading = that.$loading({ target: '#_cards' })
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
            loading.close()
          })
          .catch(res => {
            loading.close()
          })
      }
    },
    mounted() {},
    watch: {
      groupId(v) {
        if (v) {
          this.initData()
          this.loadMessages()
        }
      },
      keyword(val) {
        this.currentPage = 1
        this.messages = []
        this.loadMessages()
      }
    }
  }
</script>
<style lang="scss">
  .vx-main {
    &-cards {
      width: 100%;
      position: relative;

      &.show-tips {
        background: nth($background, 6);
      }
    }
  }
</style>
