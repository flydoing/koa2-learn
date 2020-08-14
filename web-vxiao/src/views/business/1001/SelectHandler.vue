<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <div class="select-handler">
      <template v-if="approve.isApprover">
        <template v-for="(item, i) in levels">
          <div :key="i">
            <div class="category-title text">第{{item.value}}审批人</div>
            <Relate :items="getApprovers(item.value)"
                    :plus="true"
                    :reduce="true"
                    @plus="handleAdd('to', item.value)"
                    @delete="handleRemove" />
          </div>
        </template>
        <item @click="handleAddItem"
              :hasArrow="false">
          <div slot="before"><i class="ico ico-plus"></i></div>
          <div slot="main">添加审批层级</div>
        </item>
      </template>
      <template v-else>
        <Relate :items="users"
                :plus="true"
                :reduce="true"
                @plus="handleAdd('executor')"
                @delete="handleRemove" />
      </template>
    </div>
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
        approve: 'getCreateObject'
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
      title() {
        return this.approve.isApprover ? '审批人' : '执行人'
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
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
        let approve = that.approve
        if (approve.isApprover) {
          dts = approve.approvers ? JSON.parse(JSON.stringify(approve.approvers)) : []
          let level = 3
          if (Check.isRealArray(dts)) {
            dts.sort(this.compare('approveOrder')).reverse()
            level = dts[0].approveOrder
            that.list = dts
          }
          if (approve.level) {
            level = approve.level
            that.setCreateObject({ level: 0 })
          }
          for (let i = 0; i < (level < 3 ? 3 : level); i++) {
            that.levels.push({ value: i + 1 })
          }
        } else {
          that.list = approve.executors ? JSON.parse(JSON.stringify(approve.executors)) : []
        }

        if (Check.isRealArray(approve.users)) {
          let us = approve.users.map(v => {
            return {
              type: approve.isApprover ? 'to' : 'executor',
              userId: v.userId,
              name: v.name,
              avatar: v.avatar,
              mobile: v.mobile,
              approveOrder: approve.apType || '1',
              groupId: that.groupId
            }
          })
          that.list.push(...us)
          that.setCreateObject({ users: [] })
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
        this.setCreateObject(params)
        this.routePush({ name: 'selectMember1001' })
      },
      handleAddItem() {
        this.levels.push({ value: this.levels.length + 1 })
      },
      handleSubmit() {
        const that = this
        let approve = that.approve
        if (!Check.isRealArray(that.list)) {
          that.$message({ message: `请选择${approve.isApprover ? '审批人' : '执行人'}`, type: 'warning' })
          return false
        }
        approve.isApprover ? that.setCreateObject({ approvers: that.list }) : that.setCreateObject({ executors: that.list })
        that.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-item {
    border-top: $border;
  }
</style>
