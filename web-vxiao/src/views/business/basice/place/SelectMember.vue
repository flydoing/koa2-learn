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
  import Check from '@/utils/check'

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
    computed: {},
    methods: {
      fetchData() {
        const that = this
        let admins = this.getStorage('_place_admins_cache', true)
        let filterMap = new Map()
        if (Check.isRealArray(admins)) {
          admins.map(v => {
            filterMap.set(v.userId, v)
          })
        }
        GroupApi.getSchoolTeachers(this.currentGroup.parentId).then(res => {
          that.users = res.relations.filter(v => {
            return Check.isNullObject(filterMap.get(v.userId))
          })
        })
      },
      handleSubmit(ms) {
        let admins = this.getStorage('_place_admins_cache')
        this.setStorage('_place_admins_cache', [...admins, ...ms])
        this.routeBack()
      }
    }
  }
</script>
