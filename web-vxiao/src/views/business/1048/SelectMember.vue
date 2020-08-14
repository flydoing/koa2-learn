<template>
  <SelectUser title="选择成员/群组" :cache="cache" :users="members" :multiselect="true" @submit="handleSubmit" />
</template>
<script>
import R from '@/views/group/mixin'
import GroupApi from '@/api/group'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  components: {
    SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
  },
  data() {
    return {
      members: [],
      cache: []
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      commend: 'getCommend'
    })
  },
  methods: {
    ...mapActions(['setCommend']),
    fetchData() {
      const that = this
      let userType = that.routeQuery('type')
      let groupId = that.routeQuery('groupId')
      if (userType) {
        GroupApi.getGroupUsersByType(groupId || that.currentGroup.groupId, userType).then(res => {
          that.members = res.relations
        })
      } else { 
        GroupApi.getGroupUsers(groupId || that.currentGroup.groupId).then(res => {
          that.members = res.relations
        })
      }
      that.cache = that.commend.users
    },
    handleSubmit(ms) {
      this.setCommend({ users: ms, total: this.members.length })
      this.routeBack()
    }
  }
}

</script>
