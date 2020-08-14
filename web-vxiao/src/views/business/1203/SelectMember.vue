<template>
  <SelectUser title="选择成员"
              :cache="cache"
              :users="members"
              :multiselect="true"
              @submit="handleSubmit" />
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
        obj: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this
        let job = this.obj.job
        this.cache = job.users || []
        GroupApi.getGroupUsers(that.groupId).then(res => {
          that.members = res.relations || []
        })
      },
      handleSubmit(ms) {
        this.setCreateObject({ job: { ...this.obj.job, users: ms } })
        this.routeBack()
      }
    }
  }
</script>
