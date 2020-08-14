<template>
  <SelectUsers title="选择重做学生" :users="users" :multiselect='true' @submit="handleSubmit" />
</template>
<script>
  import GroupApi from '@/api/group'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      SelectUsers: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    data() {
      return {
        users: []
      }
    },
    created() {
      GroupApi.getGroupStudents(this.currentGroup.groupId).then(res => {
        this.users = res.relations
      })
    },
    methods: {
      handleSubmit(users) {
        this.addMessage({
          originalId: this.routeQuery('msgId'),
          groupId: this.currentGroup.groupId,
          type: '1002',
          toUsers: users,
          isPrivate: '1',
          ...this.commonMessage()
        }).then(res => {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.routeBack()
        }).catch(res => {})
      }
    }
  }

</script>
