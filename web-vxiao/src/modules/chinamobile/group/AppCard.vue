<template>
  <scroller :height="sh"
            id="_cards"
            class="vx-main-cards"
            @scrollEnd="scrollEnd">
    <template v-if="isOrg && groups.length > 0">
      <Item v-for="g in groups"
            :key="g.groupId"
            @click="handleGroup(g)">
        <div>{{g.name}}</div>
      </Item>
    </template>
    <template v-else-if="messages.length>0">
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
  import Check from '@/utils/check'
  import { mapGetters } from 'vuex'
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
    },
    data() {
      return {
        groups: []
      }
    },
    computed: {
      ...mapGetters({
        currentApp: 'getCurrentApp'
      }),
      sh() {
        return this.innerHeight - 75 - 40 - 10
      },
      appType() {
        let app = this.currentApp || {}
        let appType = app.type
        if (app.type === '1049') {
          appType = '104901'
        } else if (app.type === '1144') {
          appType = '114401'
        } else if (app.type === '1158') {
          appType = '1159'
        } else if (app.type === '1160') {
          appType = '1161'
        } else if (app.type === '1162') {
          appType = '1163'
        } else if (app.type === '1165') {
          appType = '1157'
        } else if (app.type === '1216') {
          appType = '121601'
        } else if (app.type === '1264') {
          appType = '126401'
        } else if (app.type === '1283') {
          appType = '128302'
        } else if (app.type === '1284') {
          appType = '128401'
        } else if (app.type === '1285') {
          appType = '128502'
        } else if (app.type === '1289') {
          appType = '128901'
        }
        return appType
      }
    },
    methods: {
      fetchData() {
        if (this.isOrg) {
          GroupApi.getAppGroups(this.schoolId, this.currentApp.type).then(res => {
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
      loadMessages() {
        const that = this
        const loading = that.$loading({ target: '#_cards' })
        this.getMessages({
          groupId: that.groupId,
          type: that.appType,
          queryType: 'type',
          currentPage: that.currentPage
        })
          .then(res => {
            loading.close()
          })
          .catch(res => {
            loading.close()
          })
      },
      handleGroup(g) {
        this.setStorage('_message_params_cache', {
          type: this.appType,
          groupId: g.groupId,
          queryType: 'keyword'
        })
        this.setStorage('_message_list_refresh', true)
        this.routePushModel({
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
      appType(v) {
        if (v) {
          this.groups = []
          this.initData()
          this.fetchData()
        }
      }
    }
  }
</script>
