<template>
  <page title="栏目管理员">
    <Relate :items="users"
            :plus="true"
            :reduce="true"
            @plus="handleAdd"
            @delete="handleRemove" />
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        users: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        active: 'getCreateObject'
      })
    },
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        if (Check.isRealArray(this.active.admins)) {
          this.users = this.active.admins
        } else {
          this.users = this.active.column.managers || []
        }
      },
      handleAdd() {
        this.setCreateObject({ admins: this.users, objects: [], group: null })
        this.routePush({ name: 'selectGroup1011' })
      },
      handleRemove(u, i) {
        const that = this
        let user = {
          schoolId: that.currentGroup.parentId,
          status: 'd',
          type: '1011',
          userId: u.userId,
          categoryId: that.active.column.id,
          id: u.id
        }
        GroupApi.modifyAppAdmins([user]).then(res => {
          that.users.splice(i, 1)
          that.$message({ message: '操作成功', type: 'success' })
        })
      }
    }
  }
</script>
