<template>
  <AppPage :title="app.name"
           ref="_page"
           @scrollEnd="scrollEnd"
           scrollTrigger
           :showTips="showTips">
    <div slot="btn">
      <label @click="summaryHandle"
             v-if="isTeacher || isAdmin">总结</label>
    </div>
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
    <template v-if="isOrg && groups.length > 0">
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
  </AppPage>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import GroupApi from '@/api/group'
  export default {
    mixins: [R, MixinMessage],
    props: { app: Object, hasSearch: { type: Boolean, default: true } },
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve),
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
    },
    data() {
      return {
        keyword: '',
        groups: []
      }
    },
    computed: {
      showTips() {
        if (this.isOrg) {
          return this.groups && this.groups.length === 0
        }
        return this.messages.length === 0
      },
      curApp() {
        return this.currentApp || this.app
      }
    },
    methods: {
      loadMessages($load) {
        const that = this
        if (!Check.isNullObject(that.curApp)) {
          that.loading = true
          this.getMessages({
            groupId: that.groupId,
            type: that.curApp.type,
            keyword: that.keyword,
            queryType: that.keyword !== '' ? 'keyword' : 'type',
            currentPage: that.currentPage
          })
            .then(res => {
              that.loading = false
              $load && $load.close()
            })
            .catch(res => {
              that.loading = false
              $load && $load.close()
            })
        }
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
                if (groups[0].groupId === this.groupId) {
                  this.loadMessages()
                } else {
                  this.groups = groups
                }
              }
            }
          })
        } else {
          this.loadMessages()
        }
      },
      summaryHandle() {
        this.routePush({
          name: 'eventSummary1189'
        })
      },
      handleGroup(g) {
        this.setStorage('_message_params_cache', {
          type: this.curApp.type,
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
        this.fetchData()
      })
    },
    watch: {
      keyword(v) {
        this.groups = []
        this.initData()
        this.fetchData()
        this.$emit('search', v)
      },
      currentApp(v) {
        this.groups = []
        this.initData()
        this.fetchData()
      }
    }
  }
</script>
