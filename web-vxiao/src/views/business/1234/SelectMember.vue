<template>
  <SelectUser title="选择成员" :cache="cache" :users="members" :multiselect="true" @submit="handleSubmit"></SelectUser>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    data() {
      return {
        members: [],
        cache: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        exchange: 'getExchangeCourse'
      })
    },
    methods: {
      ...mapActions(['setExchangeCourse']),
      fetchData() {
        this.cache = this.exchange.users || []
        GroupApi.getGroupUsers(this.currentGroup.groupId).then(res => {
          this.members = res.relations
        })
      },
      handleSubmit(ms) {
        this.setExchangeCourse({ users: ms })
        this.routeBack()
      }
    }
  }

</script>
