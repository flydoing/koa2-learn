<template>
  <SelectUser title="选择学生"
              :cache="cache"
              :users="users"
              :multiselect="false"
              @change="handleSelect"></SelectUser>
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
        cache: [],
        className: ''
      }
    },
    created() {
      if (this.routeQuery('title')) {
        this.className = this.routeQuery('title')
      }
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        mien: 'getStudentMien'
      })
    },
    methods: {
      ...mapActions(['setStudentMien']),
      fetchData() {
        const that = this
        that.cache = that.mien.user ? [that.mien.user] : []
        if (this.routeQuery('groupId')) {
          GroupApi.getGroupStyleUsers(this.routeQuery('groupId'), 'student').then(res => {
            that.users = res.relations
          })
        } else {
          GroupApi.getGroupStyleUsers(that.currentGroup.groupId, '4').then(res => {
            that.users = res.relations
          })
        }
      },
      handleSelect(user) {
        if (this.isSchool) {
          user['name'] = this.className + '\xa0\xa0\xa0' + user.name
        }
        this.setStudentMien({ user: user })
        if (this.isSchool) {
          this.routeBack(-2)
        } else {
          this.routeBack()
        }
      }
    }
  }
</script>
