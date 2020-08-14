<template>
  <SelectUser title="选择成员" :cache="cache" :users="users" :needValidate="false" :multiselect="true" @submit="handleSubmit"></SelectUser>
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
        cache: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        doc: 'getDocument'
      })
    },
    methods: {
      ...mapActions(['setDocument']),
      fetchData() {
        const that = this
        that.cache = that.doc.users || []

        let filterMap = new Map()
        if (Check.isRealArray(that.doc.filters)) {
          that.doc.filters.map(v => {
            filterMap.set(v.userId, v)
          })
          that.setDocument({ filters: [] })
        }

        GroupApi.getGroupUsers(that.currentGroup.groupId).then(res => {
          that.users = res.relations.filter(v => {
            return !Check.isObject(filterMap.get(v.userId))
          })
        })
      },
      handleSubmit(ms) {
        this.setDocument({ users: ms })
        this.routeBack()
      }
    }
  }

</script>
