<template>
  <page title="默认处理人设置"
        @submit="handleSubmit"
        hasSubmit>
    <div class="handler-setting">
      <template v-for="(item, i) in levels">
        <div :key="i">
          <div class="category-title text">第{{item.value}}审批人</div>
          <Relate :items="getApprovers(item.value)"
                  :plus="true"
                  :reduce="true"
                  @plus="handleAdd('to', item.value)"
                  @delete="handleApproverRemove" />
        </div>
      </template>
      <item @click="handleAddItem"
            :hasArrow="false">
        <div slot="before"><i class="ico ico-plus"></i></div>
        <div slot="main">添加审批层级</div>
      </item>
      <div class="category-title text">备案人</div>
      <Relate :items="exs"
              :plus="true"
              :reduce="true"
              @plus="handleAdd('executor')"
              @delete="handleExcutorRemove" />
    </div>
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
        approvers: [],
        levels: [],
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
      aps() {
        return this.initUserData(this.approvers)
      },
      exs() {
        return this.initUserData(this.executors)
      }
    },
    methods: {
      ...mapActions(['setLeave']),
      // 比较字段数值大小
      compare(property) {
        return (a, b) => {
          let v1 = a[property]
          let v2 = b[property]
          return v1 - v2
        }
      },
      initUserData(datas) {
        let users = []
        if (Check.isRealArray(datas)) {
          users = datas.map(v => {
            return { ...v, avatar: this.url(v.avatar) }
          })
        }
        return users
      },
      getApprovers(type) {
        return this.aps.filter(v => {
          return v.approveOrder === type
        })
      },
      fetchData() {
        const that = this
        let dts = []
        if (Check.isRealArray(this.leave.approvers)) {
          dts = JSON.parse(JSON.stringify(this.leave.approvers))
          this.setLeave({ approvers: [] })
        }
        that.executors = JSON.parse(JSON.stringify(that.leave.executors))

        let level = 3
        if (Check.isRealArray(dts)) {
          dts.sort(this.compare('approveOrder')).reverse()
          level = dts[0].approveOrder
          this.approvers = dts
        }
        if (this.leave.level) {
          level = this.leave.level
        }
        for (let i = 0; i < (level < 3 ? 3 : level); i++) {
          this.levels.push({ value: i + 1 })
        }

        if (Check.isRealArray(this.leave.users)) {
          let us = this.leave.users.map(v => {
            return {
              type: this.leave.isApprover ? 'to' : 'executor',
              userId: v.userId,
              name: v.name,
              avatar: v.avatar,
              mobile: v.mobile,
              approveOrder: this.leave.apType || '1',
              groupId: this.groupId
            }
          })
          if (this.leave.isApprover) {
            this.approvers.push(...us)
          } else {
            this.executors.push(...us)
          }
          this.setLeave({ users: [] })
        }
      },
      handleApproverRemove(u) {
        this.approvers.forEach((v, i) => {
          if (u.userId === v.userId) {
            this.approvers.splice(i, 1)
          }
        })
      },
      handleExcutorRemove(u) {
        this.executors.forEach((v, i) => {
          if (u.userId === v.userId) {
            this.executors.splice(i, 1)
          }
        })
      },
      handleAdd(type, order) {
        let filters = type === 'to' ? this.approvers : this.executors
        this.setLeave({
          apType: order,
          approvers: this.approvers,
          filters: filters,
          level: this.levels.length,
          executors: this.executors,
          isApprover: type === 'to'
        })
        this.routePush({ name: 'selectMember1235' })
      },
      handleAddItem() {
        this.levels.push({ value: this.levels.length + 1 })
      },
      handleSubmit() {
        const that = this
        let users = []
        if (Check.isRealArray(this.approvers)) {
          users.push(...this.approvers)
        }
        if (Check.isRealArray(this.executors)) {
          users.push(...this.executors)
        }
        if (!Check.isRealArray(users)) {
          that.$message({ message: '请选择默认处理人', type: 'warning' })
          return false
        }
        Api.commitDefaultHandlers(that.currentGroup.groupId, users).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-item {
    border: $border;
  }
</style>
