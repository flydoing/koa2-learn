<template>
  <SelectUser title="选择成员"
              :users="users"
              :multiselect="true"
              :needValidate="false"
              @submit="handleSubmit" />
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import Api from './api'
  import Check from '@/utils/check'
  import { mapGetters } from 'vuex'

  export default {
    mixins: [R],
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
        onDuty: 'getOnDuty'
      })
    },
    methods: {
      fetchData() {
        const that = this
        let filterMap = new Map()
        let week = that.onDuty.week
        if (week && Check.isRealArray(week.cells)) {
          week.cells.map(v => {
            filterMap.set(v.userId, v)
          })
        }
        GroupApi.getGroupUsersByType(this.groupId, '4').then(res => {
          that.users = res.relations.filter(v => {
            return Check.isNullObject(filterMap.get(v.userId))
          })
        })
      },
      handleSubmit(ms) {
        if (!Check.isRealArray(ms)) {
          this.$message({ message: '请选择成员', type: 'warning' })
          return false
        }
        let week = this.onDuty.week
        Api.modifyOnDutyUsers({
          days: [
            {
              ...week,
              cells: ms.map(v => {
                return {
                  userId: v.userId
                }
              })
            }
          ]
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      }
    }
  }
</script>
