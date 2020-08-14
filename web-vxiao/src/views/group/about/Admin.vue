<template>
  <Page title="管理员">
    <Relate :items="users" :plus="isAdmin" :reduce="isAdmin" @delete="handleDelete" @plus="handlePlus" />
  </Page>
</template>
<script>
  import Api from '@/api/group'
  import Check from '@/utils/check'
  import R from '../mixin'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    computed: {
      users() {
        const that = this
        let users = []
        if (Check.isRealArray(that.admins)) {
          that.admins.some(u => {
            users.push(Object.assign({}, u, { avatar: that.url(u.avatar) }))
          })
        }
        return users
      }
    },
    methods: {
      ...mapActions(['modifyRelation']),
      handlePlus() {
        this.routePush({
          path: '/vx/group/about/admin/add'
        })
      },
      handleDelete(u, i) {
        this.$confirm(`确认取消 ${u.name} 的管理员身份吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.addGroupRelation({
            relations: [{
              id: u.id,
              groupId: u.groupId,
              userId: u.userId,
              type: 2
            }]
          }).then(res => {
            if (Check.isRealArray(res.relations)) {
              res.relations.forEach(r => {
                this.modifyRelation(r)
              })
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
      }
    }
  }

</script>
