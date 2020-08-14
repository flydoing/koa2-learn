<template>
  <SelectUser title="选择成员/群组" :cache="cache" :users="members" :needValidate="false" :multiselect="true" @submit="handleSubmit" />
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
      appraisal: 'getTeacherAppraisal'
    })
  },
  methods: {
    ...mapActions(['setTeacherAppraisal']),
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
      that.cache = that.appraisal.users
    },
    handleSubmit(ms) {
      this.setTeacherAppraisal({ users: ms })
      this.routeBack()
    }
  }
}

</script>
