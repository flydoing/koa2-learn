<template>
  <page title="默认备案人"
        @submit="handleSubmit"
        hasSubmit>
    <Relate :items="exs"
            :plus="true"
            :reduce="true"
            @plus="handleAdd"
            @delete="handleRemove" />
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    data() {
      return {
        executors: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        leave: 'getLeave'
      }),
      exs() {
        return this.initUserData(this.executors)
      }
    },
    methods: {
      ...mapActions(['setLeave', 'deleteLeaveProp']),
      initUserData(datas) {
        let users = []
        if (Check.isRealArray(datas)) {
          users = datas.map(v => {
            return { ...v, avatar: this.url(v.avatar) }
          })
        }
        return users
      },
      fetchData() {
        const that = this
        if (this.leave.filters) {
          that.executors = JSON.parse(JSON.stringify(this.leave.filters))
          this.deleteLeaveProp('filters')
        } else if (that.leave.executors) {
          that.executors = JSON.parse(JSON.stringify(that.leave.executors))
        }

        if (Check.isRealArray(this.leave.users)) {
          let us = this.leave.users.map(v => {
            return {
              type: 'executor',
              userId: v.userId,
              name: v.name,
              avatar: v.avatar,
              mobile: v.mobile,
              approveOrder: '1',
              groupId: this.groupId
            }
          })
          this.executors.push(...us)
          this.deleteLeaveProp('users')
        }
      },
      handleRemove(u) {
        this.executors.forEach((v, i) => {
          if (u.userId === v.userId) {
            this.executors.splice(i, 1)
          }
        })
      },
      handleAdd() {
        this.setLeave({ filters: this.executors })
        this.routePush({ name: 'selectMember1235' })
      },
      handleSubmit() {
        const that = this
        if (!Check.isRealArray(this.executors)) {
          that.$message({ message: '请选择默认处理人', type: 'warning' })
          return false
        }
        Api.saveHandlers({
          teacherLeavePersons: this.executors
        }).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/_mixin';

  .vx-item {
    border: $border;
  }
</style>
