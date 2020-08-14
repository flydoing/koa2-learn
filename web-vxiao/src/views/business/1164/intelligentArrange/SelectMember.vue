<template>
  <SelectUser title="选择成员"
              :cache="cache"
              :users="users"
              :multiselect="true"
              :needValidate="false"
              :closePrompt="true"
              @submit="handleSubmit" />
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
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
        arrange: 'getArrangeExam'
      })
    },
    methods: {
      ...mapActions(['setArrangeExam']),
      fetchData() {
        const that = this
        let groupId = that.routeQuery('groupId')
        let filterMap = new Map()
        if (Check.isRealArray(that.arrange.filters)) {
          that.arrange.filters.map(v => {
            filterMap.set(v.userId, v)
          })
        }
        if (Check.isRealArray(that.arrange.groups)) {
          that.arrange.groups.map(v => {
            if (Check.isRealArray(v.users) && v.groupId !== groupId) {
              v.users.map(u => {
                filterMap.set(u.userId, u)
              })
            }
          })
        }

        let userType = that.routeQuery('userType')
        if (userType) {
          GroupApi.getGroupUsersByType(groupId, userType).then(res => {
            that.users = res.relations.filter(v => {
              return Check.isNullObject(filterMap.get(v.userId))
            })
          })
        } else {
          GroupApi.getGroupUsers(groupId).then(res => {
            that.users = res.relations.filter(v => {
              return Check.isNullObject(filterMap.get(v.userId))
            })
          })
        }
        that.cache = that.arrange.users
      },
      handleSubmit(ms) {
        this.setArrangeExam({ group: { ...this.arrange.group, users: ms } })
        this.routeBack()
      }
    }
  }
</script>
