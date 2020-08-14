<template>
  <SelectUser title="选择学生" :users="users" @change="handleSelect"></SelectUser>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'

  export default {
    mixins: [R],
    props: {},
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
        let users = []
        if (that.isParent) {
          GroupApi.getGroupUserChildren(that.currentGroup.groupId).then(res => {
            if (Check.isRealArray(res.relations)) {
              res.relations.forEach(u => {
                users.push(Object.assign({ selected: false }, u))
              })
              that.users = users
            }
          })
        } else if (that.isTeacher || that.isAdmin) {
          GroupApi.getGroupStudents(that.currentGroup.groupId).then(res => {
            if (Check.isRealArray(res.relations)) {
              res.relations.forEach(u => {
                users.push(Object.assign({ selected: false }, u))
              })
              that.users = users
            }
          })
        }
      },
      handleSelect(u) {
        this.setStorage('_summary_user_cache', u)
        this.routeBack()
      }
    }
  }

</script>
