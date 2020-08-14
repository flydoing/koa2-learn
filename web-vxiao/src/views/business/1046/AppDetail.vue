<template>
  <Page :title="app.name"
        @scrollEnd="scrollEnd"
        ref="_page"
        :showTips="showTips">
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
    <AppCommon :app="app" />
    <div class="category-title"
         v-if="messages.length > 0 || groups.length > 0"></div>
    <template v-if="isOrg">
      <Item v-for="g in groups"
            :key="g.groupId"
            @click="handleGroup(g)">
        <div>{{g.name}}</div>
      </Item>
    </template>
    <template v-else>
      <CardList :messages="messages" />
      <div v-if="hasNextPage===0"
           class="vx-more">没有更多了</div>
    </template>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters } from 'vuex'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve),
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
    },
    data() {
      return {
        app: {},
        keyword: '',
        reportItems: []
      }
    },
    created() {
      this.app = this.$store.getters.getAppByType(this.routeQuery('appType'), this.routeQuery('groupId'))
    },
    computed: {
      ...mapGetters(['getGroupsBySchoolId']),
      groups() {
        return this.getGroupsBySchoolId(this.currentGroup.parentId)
      },
      showTips() {
        if (this.isOrg) {
          return this.groups && this.groups.length === 0
        }
        return this.messages.length === 0
      }
    },
    methods: {
      loadMessages() {
        let that = this
        if (!Check.isNullObject(that.app)) {
          let loading = that.$loading()
          that
            .getMessages({
              groupId: this.routeQuery('groupId'),
              type: that.app.type,
              keyword: that.keyword,
              queryType: that.keyword !== '' ? 'keyword' : 'type',
              currentPage: that.currentPage
            })
            .then(res => {
              loading.close()
            })
            .catch(res => {
              loading.close()
            })
        }
      },
      handleGroup(g) {
        this.setStorage('_message_params_cache', {
          type: this.app.type,
          groupId: g.groupId,
          queryType: 'keyword'
        })
        this.setStorage('_message_list_refresh', true)
        this.routePush({
          path: '/vx/group/business/message/list',
          query: { title: g.name }
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.loadMessages()
      })
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
