<template>
  <SelectUser :title="title"
              :users="users"
              :multiselect='true'
              @submit="handleSubmit" />
</template>
<script>
  import R from '../mixin'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    computed: {
      users() {
        let caches = this.getStorage('_cache_user_select')
        let us = this.getGroupUsers(this.groupId, this.userType) || []
        if (Check.isRealArray(caches) && Check.isRealArray(us)) {
          let uMap = new Map()
          caches.map(v => {
            uMap.set(v.userId, v)
          })
          return us.filter(v => {
            return !Check.isObject(uMap.get(v.userId))
          })
        }
        return us
      }
    },
    data() {
      return {
        loading: false,
        title: '',
        userType: ''
      }
    },
    created() {
      this.userType = this.routeQuery('userType') || '1_2_3'
      this.title = this.routeQuery('title') || '成员选择'
    },
    methods: {
      handleSubmit(checkList) {
        this.setStorage('_cache_user_select', checkList)
        this.routeBack()
      }
    }
  }
</script>
