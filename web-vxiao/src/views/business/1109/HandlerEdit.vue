<template>
  <page :title="title">
    <Relate :items="users" :plus="true" :reduce="true" @plus="handleAdd" @delete="handleRemove" />
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
      expense: 'getExpense'
    }),
    title() {
      return this.expense.isApprover ? '审批人' : '批准人'
    }
  },
  components: {
    Relate: resolve => require(['@/views/components/relate/Index'], resolve)
  },
  methods: {
    ...mapActions(['setExpense']),
    fetchData() {
      if (Check.isRealArray(this.expense.users)) {
        this.users = this.expense.users
      }
    },
    handleAdd() {
      this.setExpense({ users: this.users })
      this.routePush({ name: 'selectMember1109' })
    },
    handleRemove(u, i) {
      const that = this
      let meta = {
        extension: that.currentGroup.groupId,
        metaType: that.expense.isApprover ? 'm_wiped_approve_person' : 'm_wiped_executor_person',
        userId: u.userId,
        status: 'd',
        id: u.id
      }
      GroupApi.updateMetaData([meta]).then(res => {
        that.users.splice(i, 1)
        that.$message({ message: '操作成功', type: 'success' })
      })
    }
  }
}

</script>
