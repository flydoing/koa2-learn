<template>
  <Page title="应用管理员">
    <Relate :items="users"
            :plus="isAdmin"
            :reduce="isAdmin"
            @delete="handleDelete"
            @plus="handlePlus" />
  </Page>
</template>
<script>
  import R from '../mixin'
  import Api from './api'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    data() {
      return {
        appAdmins: []
      }
    },
    computed: {
      users() {
        const that = this
        let users = {}
        if (Check.isRealArray(that.appAdmins)) {
          that.appAdmins.some(u => {
            users[u.userId] = Object.assign({}, u, { avatar: that.url(u.avatar) })
          })
        }
        return Object.values(users)
      }
    },
    activated() {
      Api.loadAppAdmins(this.currentGroup.parentId, this.routeQuery('appType'), this.isOrg ? null : this.groupId).then(res => {
        this.appAdmins = res.appManagers || []
      })
      let users = this.getStorage('_cache_user_select')
      if (users) {
        let uMap = new Map()

        let admins = []
        users.forEach(u => {
          let user = {
            schoolId: this.currentGroup.parentId,
            status: '1',
            type: this.routeQuery('appType'),
            userId: u.userId
          }
          if (!this.isSchool) {
            user.groupId = this.groupId
          }
          admins.push(user)
          uMap.set(u.userId, u)
        })

        Api.addAppAdmins({
          appManagers: admins
        }).then(res => {
          let us = res.appManagers.map(v => {
            let user = uMap.get(v.userId)
            return { ...v, avatar: user.avatar, name: user.name }
          })
          this.appAdmins = [...this.appAdmins, ...us]
          this.$message({ message: '操作成功', type: 'success' })
        })
      }
    },
    methods: {
      handlePlus() {
        if (this.isSchool) {
          this.routePush({
            path: '/vx/group/business/app/select/group'
          })
        } else {
          this.setStorage('_cache_user_select', this.users)
          this.routePush({
            path: '/vx/group/user/select'
          })
        }
      },
      handleDelete(u, i) {
        this.$confirm(`确认取消 ${u.name} 的应用管理员身份吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.addAppAdmins({
            appManagers: [
              {
                id: u.id,
                groupId: this.groupId,
                schoolId: this.currentGroup.parentId,
                status: 'd',
                type: this.routeQuery('appType'),
                userId: u.userId
              }
            ]
          }).then(res => {
            this.appAdmins.some((_u, i) => {
              if (u.userId === _u.userId) {
                this.appAdmins.splice(i, 1)
              }
            })
          })
        })
      }
    }
  }
</script>
