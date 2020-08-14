<template>
  <SelectUser title="选择成员"
              :users="users"
              :cache="cache"
              :needValidate="false"
              :multiselect="multiple"
              @submit="handleSubmit"
              @change="handleSelect"></SelectUser>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    props: {},
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    data() {
      return {
        users: [],
        multiple: true,
        cache: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        leave: 'getLeave'
      })
    },
    methods: {
      ...mapActions(['setLeave', 'deleteLeaveProp']),
      fetchData() {
        const that = this
        let filterMap = new Map()
        if (Check.isRealArray(that.leave.filters)) {
          that.leave.filters.map(v => {
            filterMap.set(v.userId, v)
          })
        }
        if (that.leave.isStudent) {
          this.multiple = false
          this.cache = this.leave.users || []
          this.deleteLeaveProp('isStudent')
          GroupApi.getGroupUsersByType(that.groupId, '2').then(res => {
            that.users = res.relations
          })
        } else {
          GroupApi.getGroupUsers(that.groupId).then(res => {
            that.users = res.relations.filter(v => {
              return !Check.isObject(filterMap.get(v.userId))
            })
          })
        }
      },
      handleSubmit(ms) {
        this.setLeave({ users: ms })
        this.routeBack()
      },
      handleSelect(u) {
        this.setLeave({ users: [u] })
        this.routeBack()
      }
    }
  }
</script>
