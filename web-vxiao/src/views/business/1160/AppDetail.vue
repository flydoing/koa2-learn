<template>
  <AppPage :title="app.name"
           @scrollEnd="scrollEnd">
    <template v-if="hasSearch">
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
      <div class="category-title"></div>
    </template>
    <AppCommon :app="curApp" />
    <div class="category-title"
         v-if="messages.length > 0 || groups.length > 0"></div>
    <template v-if="isOrg && groups.length>0">
      <Item v-for="g in groups"
            :key="g.groupId"
            @click="handleGroup(g)">
        <div>{{g.name}}</div>
      </Item>
    </template>
    <template v-else>
      <div class="teachers">
        <template v-for="(msg, i) in messages">
          <CardColumn v-if="messages.length>0"
                      :key="i"
                      :message="msg"
                      @click="CardColumnClick($event,msg)"></CardColumn>
        </template>
        <div v-if="hasNextPage===0"
             class="vx-more">没有更多了</div>
      </div>
    </template>
  </AppPage>
</template>
<script>
  import Api from '@/api/message'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  export default {
    props: { app: Object, hasSearch: { type: Boolean, default: true } },
    mixins: [R, MixinMessage],
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve),
      CardColumn: resolve => require(['@/views/components/card/CardColumn'], resolve)
    },
    data() {
      return {
        messages: [],
        hasNextPage: 0,
        currentPage: 1,
        keyword: '',
        groups: []
      }
    },
    computed: {
      curApp() {
        return this.currentApp || this.app
      }
    },
    methods: {
      loadMsgList(queryType, $load) {
        const that = this
        Api.getMessages({
          groupId: that.groupId,
          currentPage: that.currentPage,
          keyword: that.keyword !== '' ? that.keyword : void 0,
          queryType: that.keyword !== '' ? 'keyword' : 'type',
          type: '1161'
        })
          .then(res => {
            if (res.hasNextPage > 0) {
              that.hasNextPage = res.hasNextPage
              that.currentPage = res.currentPage
            } else {
              that.hasNextPage = 0
            }
            queryType === 'more' ? (that.messages = [...that.messages, ...res.messages]) : (that.messages = res.messages || [])
            $load && $load.close()
          })
          .catch(res => {
            $load && $load.close()
          })
      },
      fetchData() {
        if (this.isOrg) {
          GroupApi.getAppGroups(this.currentGroup.parentId, this.curApp.type).then(res => {
            let groups = []
            if (Check.isRealArray(res.groups)) {
              res.groups.map(v => {
                v.groups.map(g => {
                  groups.push(g)
                })
              })
              if (groups.length > 1) {
                this.groups = groups
              } else {
                this.loadMsgList()
              }
            }
          })
        } else {
          this.loadMsgList()
        }
      },
      handleGroup(g) {
        this.setStorage('_message_params_cache', {
          type: '1161',
          groupId: g.groupId,
          queryType: 'keyword'
        })
        this.setStorage('_message_list_refresh', true)
        this.routePush({
          path: '/vx/group/business/message/list',
          query: { title: g.name }
        })
      },
      scrollEnd(status, $load) {
        this.hasNextPage > 0 && this.loadMsgList('more', $load)
      },
      CardColumnClick(event, m) {
        this.routePush({
          name: 'cardDetail1161',
          params: {
            msgId: m.id
          },
          query: {
            type: m.type
          }
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.fetchData()
      })
    },
    watch: {
      keyword(v) {
        this.groups = []
        this.initData()
        this.fetchData()
      },
      currentApp(v) {
        this.groups = []
        this.initData()
        this.fetchData()
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .teachers {
    background-color: #ededed;
  }
</style>
