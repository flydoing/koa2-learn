<template>
  <SelectUser title="新建教师评价"
              :cache="cache"
              :users="users"
              :multiselect="true"
              @submit="handleNext"></SelectUser>
</template>
<script>
import R from '@/views/group/mixin'
import Check from '@/utils/check'
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
  activated() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      teacherDate: 'getTeacherDate'
    })
  },
  methods: {
    ...mapActions(['setTeacherDate']),
    fetchData() {
      const that = this
      that.cache = that.teacherDate.users || []
      that.setTeacherDate({ users: [] })
      let users = []

      GroupApi.getGroupUsers(that.currentGroup.groupId).then(res => {
        let groups = []
        if (Check.isRealArray(res.groups)) {
          res.groups.map(g => {
            groups.push({
              id: g.id,
              userId: g.id,
              avatar: g.logo ? g.logo : 'group',
              name: g.name,
              type: 'group',
              userType: g.type,
              selected: false
            })
          })
        }
        if (Check.isRealArray(res.relations)) {
          res.relations.forEach(u => {
            users.push(Object.assign({ selected: false }, u))
          })
        }
        that.users = [...groups, ...users]
      })
    },
    handleNext(users) {
      if (!Check.isRealArray(users)) {
        this.$message({ message: '请选择成员', type: 'warning' })
        return false
      }
      this.setTeacherDate({ users: users })
      this.routePush({ name: 'sendMedal1264' })
    }
  }
}
</script>
