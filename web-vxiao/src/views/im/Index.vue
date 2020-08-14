<template>
  <div>
    <MenuPage>
      <template slot="left">
        <Item :hasClick="false"
              class="full-input search">
          <div slot="before">
            <i class="ico ico-search"></i>
          </div>
          <input slot="main"
                 placeholder="搜索"
                 v-model="keyword" />
        </Item>
        <ItemDetail v-for='(m,i) in searchSessions'
                    @click="onClick(m)"
                    :key="i"
                    :noborder="true"
                    :class="prefixCls(m)"
                    :ref="m.id">
          <div slot="avatar"
               class="avatar-bubble">
            <img class="avatar"
                 v-lazy="{src:m.avatar,error:Image.ICO_USER}"
                 alt='LOGO'>
            <span :class="prefixBubble(m)">{{m.bubbleCount}}</span>
          </div>
          <span slot="title">{{m.title}}</span>
          <span slot="remark">{{m.time}}</span>
          <span slot="content"
                v-if="m.content"
                v-html="m.content"></span>
        </ItemDetail>
        <item-text icon="ico-plus"
                   @click="add">
          <span slot="text">新建消息</span>
        </item-text>
      </template>
    </MenuPage>
  </div>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import ItemText from '@/components/item/ItemText'
  import * as Storage from '@/utils/storage'
  export default {
    props: {},
    components: { ItemText },
    data() {
      return {
        keyword: '',
        keyId: ''
      }
    },
    computed: {
      ...mapGetters({
        sessions: 'im/getImSessions',
        currentSession: 'im/getCurrentSession'
      }),
      searchSessions() {
        let arr = this.sessions
        let search = this.keyword.toLowerCase()
        if (!arr) {
          return []
        }
        if (search) {
          arr = this.sessions.filter(s => {
            return s.title.toLowerCase().indexOf(search) > -1
          })
        }
        return arr
      }
    },
    methods: {
      ...mapActions({
        loadImSession: 'im/loadImSession',
        saveCurrentSession: 'im/saveCurrentSession',
        removeBubble: 'im/removeImBubbleById'
      }),
      onClick(m) {
        this.saveCurrentSession(m)
        // 清除气泡
        if (m.bubbleCount > 0) {
          this.removeBubble(m.id)
        }
      },
      add(item, e) {
        e.stopPropagation()
        this.routePush({
          path: '/vx/im/selectGroup'
        })
      },
      prefixCls(m) {
        return [
          `im-item`,
          {
            [`active`]: this.currentSession && this.currentSession.id === m.id
          }
        ]
      },
      prefixBubble(s) {
        return [
          `bubble`,
          {
            'has-bubble': s.bubbleCount > 0
          }
        ]
      }
    },
    mounted() {
      this.keyId = this.getStorage('_im_cache_groupId_userId')
      let id = this.routeQuery('groupId') || this.routeQuery('userId') || this.keyId
      if (id) {
        let session = this.sessions.filter(v => {
          return v.groupId === id || v.userId === id
        })[0]
        if (session) {
          this.saveCurrentSession(session)
          if (session.bubbleCount > 0) {
            this.removeBubble(session.id)
          }
        } else {
          this.saveCurrentSession(null)
        }
      } else {
        this.loadImSession(this.USER.id)
        let cacheSession = Storage.local.get(`${this.USER.id}_IM`)
        if (cacheSession) {
          this.saveCurrentSession(cacheSession)
        }
      }
    },
    watch: {
      sessions(v) {
        // 如果当前会话不存在，且会话列表存在，则默认把第一条当作当前会话
        let id = this.routeQuery('groupId') || this.routeQuery('userId') || this.keyId
        if (!this.currentSession && Check.isRealArray(v) && !id) {
          this.saveCurrentSession(v[0])
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .im-item {
    background: rgba(250, 250, 250, 1);
    &:hover,
    &.active {
      background: rgba(235, 235, 236, 1);
    }
    .avatar-bubble {
      padding-left: 0;
      position: relative;
      .bubble {
        position: absolute;
        top: rem(-3);
        right: rem(-7);
      }
    }
  }
</style>
