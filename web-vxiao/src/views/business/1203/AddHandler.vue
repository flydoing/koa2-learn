<template>
  <SelectUser title="选择成员"
              :users="members"
              :multiselect="false"
              @change="handleSelect" />
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    data() {
      return {
        members: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        GroupApi.getGroupUsers(this.groupId).then(res => {
          this.members = res.relations || []
        })
      },
      handleSelect(u) {
        Api.modifyAppUsersV2({
          data: {
            id: this.routeQuery('appId'),
            groupId: this.groupId,
            userId: u.userId,
            categoryId: this.routeQuery('terminalId')
          }
        }).then(res => {
          this.setCreateObject({
            item: { ...this.obj.item, cell: res.data }
          })
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      }
    }
  }
</script>
