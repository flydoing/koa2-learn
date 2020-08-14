<template>
  <SelectUser title="选择成员" :cache="cache" :users="users" :multiselect="false" @change="handleSelect"></SelectUser>
</template>
<script>
import R from '@/views/group/mixin'
import GroupApi from '@/api/group'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  props: {},
  components: {
    SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
  },
  data() {
    return {
      users: [],
      cache: []
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      mien: 'getTeacherMien'
    })
  },
  methods: {
    ...mapActions(['setTeacherMien']),
    fetchData() {
      const that = this
      that.cache = that.mien.user ? [that.mien.user] : []
      GroupApi.getGroupStyleUsers(that.currentGroup.groupId, '2').then(res => {
        that.users = res.relations
      })
    },
    handleSelect(user) {
      this.setTeacherMien({ user: user })
      this.routeBack()
    }
  }
}

</script>
