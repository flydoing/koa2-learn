<template>
  <SelectUser title="编辑查阅人"
              :users="users"
              :multiselect="true"
              @submit="handleSubmit"></SelectUser>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'
  import DocApi from '@/views/business/1248/api'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    props: {},
    components: {
      SelectUser: (resolve) => require(['@/views/components/group/SelectUser'], resolve)
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
          that.approve.filters.map((v) => {
            filterMap.set(v.userId, v)
          })
          that.setCreateObject({ filters: [] })
        }

        GroupApi.getGroupUsers(that.groupId).then((res) => {
          that.users = res.relations.filter((v) => {
            return !Check.isObject(filterMap.get(v.userId))
          })
        })
      },
      handleSubmit(ms) {
        DocApi.saveMessageRelations({
          msgId: this.routeQuery('msgId'),
          msgJson: JSON.stringify(
            ms.map((v) => {
              return {
                userId: v.userId,
                groupId: this.groupId
              }
            })
          )
        }).then((res) => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      }
    }
  }
</script>
