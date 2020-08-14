<template>
  <page title="当值人员">
    <Relate :items="users" :plus="true" :reduce="true" @plus="handleAdd" @delete="handleRemove" />
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
      onDuty: 'getOnDuty'
    })
  },
  components: {
    Relate: resolve => require(['@/views/components/relate/Index'], resolve)
  },
  methods: {
    ...mapActions(['setOnDuty']),
    fetchData() {
      if (Check.isRealArray(this.onDuty.users)) {
        this.users = [...this.onDuty.users]
      } else {
        let users = [...this.onDuty.dutyItem.users] || []
        this.users = users.map(v => { return { ...v, avatar: this.url(v.avatar) } })
      }
    },
    handleAdd() {
      this.setOnDuty({ users: this.users, objects: [], group: null })
      this.routePush({ name: 'selectGroup1145' })
    },
    handleRemove(u, i) {
      const that = this
      let item = that.onDuty.dutyItem
      let type = that.onDuty.type
      let isOddWeek = that.onDuty.isOddWeek

      let user = {
        id: u.id,
        status: 'd',
        userId: u.userId,
        itemId: item.id,
        extension: item.gradeType === '1' ? '1' : '2'
      }
      item.gradeType === '1' ? (user.groupId = item.groupId) : (user.rangeId = item.gradeId)
      isOddWeek && (user.isOddWeeks = type.value)

      Api.commitOnDutyMembers([user]).then(res => {
        that.users.splice(i, 1)
        that.$message({ message: '操作成功', type: 'success' })
      })
    }
  }
}

</script>
