<template>
  <SelectUser title="成员选择"
              :users="users"
              :multiselect='true'
              @submit="handleSubmit" />
</template>
<script>
  import R from '../mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  export default {
    mixins: [R],
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    computed: {},
    data() {
      return {
        users: []
      }
    },
    created() {
      let groupId = this.routeQuery('groupId')
      GroupApi.getGroupUsers(groupId).then(res => {
        if (Check.isRealArray(res.relations)) {
          this.users = res.relations
        }
      })
    },
    methods: {
      handleSubmit(us) {
        this.setStorage('_cache_user_select', us)
        this.routeBack(-2)
      }
    }
  }
</script>
