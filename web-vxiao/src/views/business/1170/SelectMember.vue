<template>
  <SelectUser title="选择成员" :cache="cache" :users="users" :needValidate="false" :multiselect="true" @submit="handleSubmit"></SelectUser>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'
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
      users: [],
      cache: []
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      appraisal: 'getSuperviseAppraisal'
    })
  },
  methods: {
    ...mapActions(['setSuperviseAppraisal']),
    fetchData() {
      const that = this
      
      let appraisal = that.appraisal
      that.cache = appraisal.isDeputy ? (appraisal.deputyUsers || []) : (appraisal.users || [])
      that.cache = that.cache.map(v => { return { ...v, avatar: v.logo } })

      let uMap = new Map()
      if (appraisal.isDeputy) {
        appraisal.users.map(v => { uMap.set(v.userId, v) })
      } else {
        appraisal.deputyUsers.map(v => { uMap.set(v.userId, v) })
      }

      GroupApi.getGroupUsers(that.currentGroup.groupId).then(res => {
        that.users = res.relations.filter(v => { return !Check.isObject(uMap.get(v.userId)) })
      })
    },
    handleSubmit(ms) {
      const that = this
      let grouping = that.appraisal.grouping
      let isDeputy = that.appraisal.isDeputy
      let type = isDeputy ? '2' : '1'

      let us = ms.map(v => { return { userId: v.userId, name: v.name, avatar: v.avatar, type: type } })
      Api.commitGroupingAssessor({ sgroupId: grouping.id, spersons: us, type: type }).then(res => {
        if (isDeputy) {
          grouping = { ...grouping, deputyPersons: res.spersons || [] }
        } else {
          grouping = { ...grouping, persons: res.spersons || [] }
        }
        that.setSuperviseAppraisal({ grouping: grouping })
        that.$message({ message: '操作成功', type: 'success' })
        that.routeBack()
      })
    }
  }
}

</script>
