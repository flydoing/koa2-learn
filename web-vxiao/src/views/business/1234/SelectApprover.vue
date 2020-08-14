<template>
  <SelectUser title="选择成员" :users="users" :multiselect="false" @change="handleSelect"></SelectUser>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    data() {
      return {
        users: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      fetchData() {
        const that = this
        that.msgId = that.routeParam('msgId')
        that.msgType = that.routeQuery('msgType')

        let uMap = new Map()
        let caches = that.getStorage('approve_user_cache')
        if (Check.isRealArray(caches)) {
          caches.map(v => { uMap.set(v.userId, v) })
        }

        GroupApi.getGroupUsers(that.currentGroup.groupId).then(res => {
          that.users = res.relations.filter(r => {
            r.selected = false
            return !uMap.get(r.userId)
          })
        })
      },
      handleSelect(user) {
        const that = this
        let postData = that.constructionMessage({
          id: that.msgId,
          groupId: that.currentGroup.groupId,
          type: that.msgType,
          status: '4',
          toUsers: [{
            userId: user.userId,
            name: user.name,
            status: '1',
            avatar: user.avatar ? user.avatar : null,
            userType: user.userType,
            type: 'to'
          }]
        })
        that.modifyMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    },
    watch: {
      show(val) {
        this.visible = val
        this.initData()
      }
    }
  }

</script>
