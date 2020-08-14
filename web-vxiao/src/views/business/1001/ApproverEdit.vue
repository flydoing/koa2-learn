<template>
  <page title="编辑审批人"
        @submit="handleSubmit"
        hasSubmit>
    <div class="handler-edit">
      <template v-for="(item, i) in levels">
        <div :key="i">
          <div class="category-title text">第{{item.value}}审批人</div>
          <Relate :items="getApprovers(item.value)"
                  :plus="curApprover.approveOrder <= item.value"
                  :reduce="curApprover.approveOrder <= item.value"
                  @plus="handleAdd(item.value)"
                  @delete="handleApproverRemove" />
        </div>
      </template>
      <item @click="handleAddItem"
            :hasArrow="false">
        <div slot="before"><i class="ico ico-plus"></i></div>
        <div slot="main">添加审批层级</div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import DocApi from '@/views/business/1248/api'
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
        levels: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        approve: 'getCreateObject'
      }),
      aps() {
        if (Check.isRealArray(this.approvers)) {
          let apvs = this.approvers.filter(v => {
            return v.status !== 'd'
          })
          return this.initUserData(apvs)
        }
        return []
      },
      curApprover() {
        if (Check.isRealArray(this.approvers)) {
          return this.approvers.filter(v => {
            return v.userId === this.userId
          })[0]
        }
        return {}
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyChannelMessage']),
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
        let dts = []
        if (Check.isRealArray(this.approve.approvers)) {
          dts = JSON.parse(JSON.stringify(this.approve.approvers))
        }

        let level = 3
        if (Check.isRealArray(dts)) {
          dts.sort(this.compare('approveOrder')).reverse()
          level = dts[0].approveOrder
          this.approvers = dts
        }
        if (this.approve.level) {
          level = this.approve.level
        }
        for (let i = 0; i < (level < 3 ? 3 : level); i++) {
          this.levels.push({ value: i + 1 })
        }

        let msgId = this.routeQuery('msgId')
        if (Check.isRealArray(this.approve.users)) {
          let us = this.approve.users.map(v => {
            return {
              userId: v.userId,
              userType: v.userType,
              name: v.name,
              avatar: v.avatar,
              mobile: v.mobile,
              msgId: msgId,
              approveOrder: this.approve.apType || '1',
              status: '1'
            }
          })
          this.approvers.push(...us)
          this.setCreateObject({ users: [] })
        }
      },
      handleApproverRemove(u) {
        if (u.userId === this.userId) {
          this.$message({ message: '当前审批人不可删除', type: 'warning' })
          return false
        }
        if (u.status === '4') {
          this.$message({ message: '已审批的成员不可删除', type: 'warning' })
          return false
        }
        if (u.id) {
          this.approvers.forEach((v, i) => {
            if (u.userId === v.userId) {
              this.$set(this.approvers, i, { ...this.approvers[i], status: 'd' })
            }
          })
        } else {
          this.approvers.forEach((v, i) => {
            if (u.userId === v.userId) {
              this.approvers.splice(i, 1)
            }
          })
        }
      },
      handleAdd(order) {
        this.setCreateObject({
          apType: order,
          approvers: this.approvers,
          filters: this.approvers,
          level: this.levels.length
        })
        this.routePush({ name: 'selectMember1001' })
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

        let msgId = that.routeQuery('msgId')
        DocApi.saveMessageApprovers({
          msgId: msgId,
          approvers: users
        }).then(res => {
          if (res.message) {
            that.modifyChannelMessage(res.message)
          }
          this.setCreateObject({ approvers: [] })
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-item {
    border-top: $border;
  }
</style>
