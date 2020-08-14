<template>
  <SelectUser title="选择成员"
              :users="users"
              :needValidate="false"
              :multiselect="true"
              @submit="handleSubmit"></SelectUser>
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
        users: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        approve: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this
        let filterMap = new Map()
        if (Check.isRealArray(that.approve.filters)) {
          that.approve.filters.map(v => {
            filterMap.set(v.userId, v)
          })
          that.setCreateObject({ filters: [] })
        }

        GroupApi.getGroupUsers(that.currentGroup.groupId).then(res => {
          that.users = res.relations.filter(v => {
            return !Check.isObject(filterMap.get(v.userId))
          })
        })
      },
      handleSubmit(ms) {
        this.setCreateObject({ users: ms })
        this.routeBack()
      }
    }
  }
</script>
