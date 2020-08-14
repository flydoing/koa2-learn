<template>
  <SelectUser :title="title"
              :cache="cache"
              :users="members"
              :multiselect="true"
              @submit="handleSubmit" />
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    components: {
      SelectUser: (resolve) => require(['@/views/components/group/SelectUser'], resolve)
    },
    data() {
      return {
        members: [],
        cache: [],
        group: null
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      title() {
        return this.routeQuery('title') || ''
      }
    },
    methods: {
      fetchData() {
        const that = this

        let filterMap = new Map()
        let filters = that.getStorage('_dormitory_member_filter', true)
        if (Check.isRealArray(filters)) {
          filters.map((v) => {
            filterMap.set(v.userId, v)
          })
        }

        let groupId = that.routeQuery('groupId')
        Api.getClassMembers(groupId).then((res) => {
          if (res.relations) {
            that.members = res.relations.filter((v) => {
              return Check.isNullObject(filterMap.get(v.userId))
            })
          }
        })

        that.group = that.getStorage('_dormitory_group')
        that.cache = that.group.members || []
      },
      handleSubmit(ms) {
        this.setStorage('_dormitory_group', { ...this.group, members: ms })
        this.routeBack()
      }
    }
  }
</script>
