<template>
  <SelectUser title="选择成员" :users="members" :multiselect="true" :needValidate="true" @submit="handleSubmit" />
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'
import Check from '@/utils/check'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  components: {
    SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
  },
  data() {
    return {
      members: []
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      inspection: 'getInspection'
    })
  },
  methods: {
    ...mapActions(['setInspection']),
    fetchData() {
      const that = this
      let users = that.inspection.users

      let uMap = new Map()
      if (Check.isRealArray(users)) {
        users.map(v => { uMap.set(v.userId, v) })
      }

      let campus = that.inspection.schedule.campuses.filter(v => { return v.selected })[0]
      Api.loadInspectors(that.currentGroup.groupId, campus.id).then(res => {
        if (Check.isRealArray(res.users)) {
          res.users.map(v => {
            if (!uMap.get(v.id)) {
              that.members.push({ userId: v.id, name: v.name, avatar: v.avatar })
            }
          })
        }
      })
    },
    handleSubmit(ms) {
      const that = this
      let inspection = that.inspection
      let postData = { schoolId: that.currentGroup.parentId, dutyUsers: ms, round: inspection.item.round }

      if (inspection.item.type === 'batch') {
        let campus = that.inspection.schedule.campuses.filter(v => { return v.selected })[0]
        Api.commitScheduleBatchSetting({ ...postData, campusId: campus.id }).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      } else {
        Api.commitScheduleSetting({ ...postData, placeId: inspection.item.placeId }).then(res => {
          that.setInspection({ users: [...inspection.users, ...(res.duty.dutyUsers || [])] })
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
}

</script>
