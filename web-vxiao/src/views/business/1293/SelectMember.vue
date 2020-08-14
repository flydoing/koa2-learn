<template>
  <SelectUser title="选择成员" :cache="cache" :users="members" :multiselect="true" @submit="handleSubmit" />
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
      meeting: 'getMeeting'
    })
  },
  methods: {
    ...mapActions(['setMeeting']),
    fetchData() {
      const that = this
      GroupApi.getGroupUsers(that.currentGroup.groupId).then(res => {
        that.members = res.relations
      })
      that.cache = that.meeting.users
    },
    handleSubmit(ms) {
      this.setMeeting({ users: ms })
      this.routeBack()
    }
  }
}

</script>
