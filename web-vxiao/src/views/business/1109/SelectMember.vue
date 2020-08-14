<template>
  <SelectUser title="选择成员" :users="users" :multiselect="true" @submit="handleSubmit"></SelectUser>
</template>
<script>
import R from '@/views/group/mixin'
import Check from '@/utils/check'
import GroupApi from '@/api/group'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  props: {},
  components: {
    SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
  },
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
      expense: 'getExpense'
    })
  },
  methods: {
    ...mapActions(['setExpense']),
    fetchData() {
      const that = this

      let uMap = new Map()
      if (Check.isRealArray(that.expense.users)) {
        that.expense.users.map(v => { uMap.set(v.userId, v) })
      }

      that.users = that.groupUsers.filter(v => {
        return !uMap.get(v.userId)
      })
    },
    handleSubmit(ms) {
      const that = this
      let metas = ms.map(v => {
        return {
          extension: that.currentGroup.groupId,
          metaType: that.expense.isApprover ? 'm_wiped_approve_person' : 'm_wiped_executor_person',
          userId: v.userId
        }
      })
      GroupApi.updateMetaData(metas).then(res => {
        let us = []
        res.metaDatas.map(v => {
          let u = ms.filter(k => { return v.userId === k.userId })[0]
          u && us.push({ ...u, id: v.id })
        })
        that.$message({ message: '操作成功', type: 'success' })
        that.setExpense({ users: [...that.expense.users, ...us] })
        this.routeBack()
      })
    }
  }
}

</script>
