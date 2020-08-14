<template>
  <SelectUser :title="groupName" :users="users" hasSubmit @submit="submit" />
</template>
<script>
  import Api from '@/api/group'
  export default {
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    data() {
      return {
        groupId: '',
        groupName: '',
        users: []
      }
    },
    created() {
      this.groupId = this.routeQuery('groupId')
      this.groupName = this.routeQuery('name')
      Api.getGroupUsersByType(this.groupId, '1').then(res => {
        this.users = res.relations
      })
    },
    methods: {
      submit(u) {
        this.setStorage('mgr_group_user', u[0])
        this.routeBack()
      }
    }
  }

</script>
