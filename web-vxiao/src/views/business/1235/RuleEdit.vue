<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <item :hasClick="false"
          label="上限天数"
          v-if="!isMax">
      <input slot="remark"
             placeholder="必填"
             v-model="dayCount" />
    </item>
    <div v-for="(item, i) in levels"
         :key="i">
      <div class="category-title text">第{{item.value}}审批人</div>
      <Relate :items="getApprovers(item.value)"
              :plus="true"
              :reduce="true"
              @plus="handleAdd(item.value)"
              @delete="handleRemove" />
    </div>
    <item @click="handleAddItem"
          :hasArrow="false"
          label="添加审批层级">
      <div slot="before"><i class="ico ico-plus"></i></div>
    </item>
    <div class="button button-common"
         v-if="!isMax && leave.rule"
         @click="handleRemoveRule">删除</div>
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
        dayCount: ''
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        leave: 'getLeave'
      }),
      title() {
        let title = this.routeQuery('title')
        let txt = this.leave.rule ? '编辑规则' : '新规则'
        return title ? `${txt} - ${title}` : txt
      },
      isMax() {
        let rule = this.leave.rule || {}
        return rule.remark !== undefined
      },
      aps() {
        return this.initUserData(this.approvers)
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
        if (this.leave.filters) {
          dts = JSON.parse(JSON.stringify(this.leave.filters))
          if (this.leave.dayCount) {
            this.dayCount = this.leave.dayCount
            this.deleteLeaveProp('dayCount')
          }
          this.deleteLeaveProp('filters')
        } else if (this.leave.rule) {
          this.dayCount = this.leave.rule.value
          Api.getRuleDatas(this.groupId, this.dayCount).then(res => {
            this.approvers = res.teacherLeavePersons || []
          })
        }

        let level = 3
        if (Check.isRealArray(dts)) {
          dts.sort(this.compare('approveOrder')).reverse()
          level = dts[0].approveOrder
          this.approvers = dts
        }
        if (this.leave.level) {
          level = this.leave.level
          this.deleteLeaveProp('level')
        }
        for (let i = 0; i < (level < 3 ? 3 : level); i++) {
          this.levels.push({ value: i + 1 })
        }

        if (Check.isRealArray(this.leave.users)) {
          let us = this.leave.users.map(v => {
            return {
              type: 'to',
              userId: v.userId,
              name: v.name,
              avatar: v.avatar,
              mobile: v.mobile,
              approveOrder: this.leave.apType || '1',
              groupId: this.groupId
            }
          })
          this.approvers.push(...us)
          this.deleteLeaveProp('users')
          this.deleteLeaveProp('apType')
        }
      },
      handleRemove(u) {
        this.approvers.forEach((v, i) => {
          if (u.userId === v.userId) {
            this.approvers.splice(i, 1)
          }
        })
      },
      handleAdd(order) {
        this.setLeave({
          apType: order,
          filters: this.approvers,
          level: this.levels.length,
          dayCount: this.dayCount
        })
        this.routePush({ name: 'selectMember1235' })
      },
      handleAddItem() {
        this.levels.push({ value: this.levels.length + 1 })
      },
      handleRemoveRule() {
        this.$confirm('确认删除该规则', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.removeRule({
            groupId: this.groupId,
            rule: this.leave.rule.value
          }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.routeBack()
          })
        })
      },
      handleSubmit() {
        const that = this
        if (!this.isMax && (Check.isNullString(this.dayCount) || this.dayCount < 1)) {
          that.$message({ message: '请输入正确的上限天数（大于0的数字）', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(this.approvers)) {
          that.$message({ message: '请选择默认处理人', type: 'warning' })
          return false
        }
        Api.saveHandlers({
          teacherLeavePersons: this.approvers.map(v => {
            return { ...v, rule: this.dayCount }
          })
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
    border-bottom: 0;
  }
</style>
