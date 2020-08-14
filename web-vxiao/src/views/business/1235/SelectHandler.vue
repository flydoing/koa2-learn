<template>
  <page :title="title"
        @submit="handleSubmit"
        :hasSubmit="!isApprover || editApprover">
    <template v-if="isApprover">
      <template v-for="(item, i) in levels">
        <div :key="i">
          <div class="category-title text">第{{item.value}}审批人</div>
          <Relate :items="getApprovers(item.value)"
                  :plus="editApprover"
                  :reduce="editApprover"
                  @plus="handleAdd('to', item.value)"
                  @delete="handleRemove" />
        </div>
      </template>
      <item @click="handleAddItem"
            v-if="editApprover"
            :hasArrow="false"
            label="添加审批层级">
        <div slot="before"><i class="ico ico-plus"></i></div>
      </item>
    </template>
    <template v-else>
      <Relate :items="users"
              :plus="true"
              :reduce="true"
              @plus="handleAdd('executor')"
              @delete="handleRemove" />
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    data() {
      return {
        list: [],
        levels: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        leave: 'getLeave'
      }),
      users() {
        let us = []
        if (Check.isRealArray(this.list)) {
          us = this.list.map(v => {
            return { ...v, avatar: this.url(v.avatar) }
          })
        }
        return us
      },
      editApprover() {
        return this.leave.editApprover
      },
      isApprover() {
        return this.leave.isApprover
      },
      title() {
        return this.isApprover ? '审批人' : '备案人'
      }
    },
    methods: {
      ...mapActions(['setLeave', 'deleteLeaveProp']),
      // 比较字段数值大小
      compare(property) {
        return (a, b) => {
          let v1 = a[property]
          let v2 = b[property]
          return v1 - v2
        }
      },
      getApprovers(type) {
        return this.users.filter(v => {
          return v.approveOrder === type
        })
      },
      fetchData() {
        const that = this
        let dts = []
        let leave = that.leave
        if (this.isApprover) {
          dts = leave.approvers ? JSON.parse(JSON.stringify(leave.approvers)) : []
          let level = 3
          if (Check.isRealArray(dts)) {
            dts.sort(this.compare('approveOrder')).reverse()
            level = dts[0].approveOrder
            that.list = dts
          }
          if (leave.level) {
            level = leave.level
            that.deleteLeaveProp('level')
          }
          for (let i = 0; i < (level < 3 ? 3 : level); i++) {
            that.levels.push({ value: i + 1 })
          }
        } else {
          that.list = leave.executors ? JSON.parse(JSON.stringify(leave.executors)) : []
        }

        if (Check.isRealArray(leave.users)) {
          let us = leave.users.map(v => {
            return {
              type: this.isApprover ? 'to' : 'executor',
              userId: v.userId,
              name: v.name,
              avatar: v.avatar,
              mobile: v.mobile,
              approveOrder: leave.apType || '1',
              groupId: that.groupId
            }
          })
          that.list.push(...us)
          that.deleteLeaveProp('users')
          that.deleteLeaveProp('apType')
        }
      },
      handleRemove(u) {
        this.list.forEach((v, i) => {
          if (u.userId === v.userId) {
            this.list.splice(i, 1)
          }
        })
      },
      handleAdd(type, order) {
        let params = {
          apType: order,
          filters: this.list,
          level: this.levels.length
        }
        if (type === 'to') {
          params.approvers = this.list
        } else {
          params.executors = this.list
        }
        this.setLeave(params)
        this.routePush({ name: 'selectMember1235' })
      },
      handleAddItem() {
        this.levels.push({ value: this.levels.length + 1 })
      },
      handleSubmit() {
        const that = this
        if (!Check.isRealArray(that.list)) {
          that.$message({ message: `请选择${this.isApprover ? '备案人' : '执行人'}`, type: 'warning' })
          return false
        }
        this.isApprover ? that.setLeave({ approvers: that.list }) : that.setLeave({ executors: that.list })
        that.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-item {
    border-top: $border;
    border-bottom: 0;
  }
</style>
