<template>
  <page title="选择联系人">
    <label slot="btn"
           @click="groupChat">群聊</label>
    <Relate :items="us"
            :plus="false"
            :reduce="false"
            @edit="handleUser" />
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    data() {
      return {
        users: []
      }
    },
    computed: {
      ...mapGetters({
        sessions: 'im/getImSessions'
      }),
      us() {
        if (Check.isRealArray(this.users)) {
          return this.users.map(v => {
            return { ...v, avatar: this.url(v.avatar) }
          })
        }
        return []
      }
    },
    created() {
      GroupApi.getChatUsers(this.routeQuery('groupId')).then(res => {
        this.users = res.relations || []
      })
    },
    methods: {
      ...mapActions({ saveImSession: 'im/saveImSession' }),
      handleUser(u, i) {
        let user = {
          ...this.users[i],
          groupId: this.routeQuery('groupId'),
          userName: u.name,
          fromUserId: this.USER.id,
          userAvatar: this.users[i].avatar,
          modifyTime: DateUtils.format_0800(new Date()),
          type: '1009'
        }
        delete user.id
        this.saveImSession(user)
        this.setStorage('_im_cache_groupId_userId', u.userId)
        this.routeBack(-2)
      },
      groupChat() {
        let id = this.routeQuery('groupId')
        let name = this.routeQuery('name')
        let session = this.sessions.filter(v => {
          return v.groupId === id
        })[0]
        this.setStorage('_im_cache_groupId_userId', id)
        if (!session) {
          this.saveImSession({
            type: '1008',
            title: name,
            groupId: id,
            userName: name,
            modifyTime: DateUtils.format_0800(new Date()),
            name: name
          })
        }
        this.routeBack(-2)
      }
    }
  }
</script>
