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
  import Api from './api'
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
        order: 'getOrder'
      })
    },
    methods: {
      ...mapActions(['setOrder']),
      fetchData() {
        const that = this
        let mMap = new Map()
        if (this.order.members) {
          this.order.members.map(v => {
            mMap.set(v.userId, v)
          })
        }
        GroupApi.getGroupUsers(that.currentGroup.groupId).then(res => {
          if (res.relations) {
            that.members = res.relations.filter(v => {
              return Check.isNullObject(mMap.get(v.userId))
            })
          }
        })
        that.cache = that.order.users
      },
      handleSubmit(ms) {
        if (this.routeQuery('request')) {
          let item = this.order.item
          Api.modifyHandler({
            metaDatas: ms.map(v => {
              return {
                userId: v.userId,
                key: '1',
                obj: item.categoryId,
                metaType: 'm_group_audit_default_type',
                status: 1,
                extension: this.groupId
              }
            })
          }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.setOrder({ users: ms })
            this.routeBack()
          })
        } else {
          this.setOrder({ users: ms })
          this.routeBack()
        }
      }
    }
  }
</script>
