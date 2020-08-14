<template>
  <SelectUser :title="title"
              :users="users"
              :cache="cache"
              :multiselect="true"
              @submit="submit"></SelectUser>
</template>
<script>
import GroupApi from '@/api/group'
import { mapActions } from 'vuex'
export default {
  components: {
    SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
  },
  data() {
    return {
      users: [],
      cache: [],
      title: ''
    }
  },
  created() {
    this.title = this.routeQuery('title')
    GroupApi.getGroupUsers(this.routeQuery('groupId')).then(res => {
      this.users = res.relations
    })
    this.cache = this.getStorage('_cache_add_users') || []
  },
  methods: {
    ...mapActions(['addGroupUsers']),
    submit(users) {
      if (this.routeQuery('isClass')) {
        this.setStorage('_cache_add_users', users)
        this.routePush({
          path: '/vx/group/user/add/other',
          query: this.$route.query
        })
      } else {
        let _users = []
        users.forEach(u => {
          _users.push({
            name: u.name,
            type: '2',
            userType: '1',
            userId: u.userId,
            extension: u.groupId || void 0,
            groupId: this.routeQuery('gId')
          })
        })
        this.addGroupUsers({ relations: _users })
          .then(res => {
            this.$message({ type: 'success', message: '添加成功' })
            this.routeBack()
          })
          .catch(res => {
            this.$message({ type: 'error', message: `添加失败：${res.data.msg}` })
          })
      }
    }
  }
}
</script>
