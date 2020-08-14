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
  import Check from '@/utils/check'
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
        vote: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this
        let caches = that.vote.ranges
        GroupApi.getGroupUsers(that.currentGroup.groupId).then(res => {
          if (Check.isRealArray(caches)) {
            that.cache = caches
          } else {
            that.cache = res.relations
          }
          that.members = res.relations
        })
      },
      handleSubmit(ms) {
        if (ms.length === this.members.length) {
          this.setCreateObject({ ranges: [] })
        } else {
          this.setCreateObject({ ranges: ms })
        }
        this.routeBack()
      }
    }
  }
</script>
