<template>
  <SelectUser title="选择成员"
              :cache="cache"
              :users="users"
              :needValidate="false"
              :multiselect="true"
              @submit="handleSubmit"></SelectUser>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'

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
        active: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this
        let group = that.active.group
        that.cache = group.members || []

        let uMap = new Map()
        if (Check.isRealArray(that.active.admins)) {
          that.active.admins.map(v => {
            uMap.set(v.userId, v)
          })
        }
        if (Check.isRealArray(that.active.objects)) {
          that.active.objects.map(v => {
            if (v.groupId !== group.groupId) {
              v.members.map(m => {
                uMap.set(m.userId, m)
              })
            }
          })
        }

        GroupApi.getGroupUsers(group.groupId).then(res => {
          that.users = res.relations.filter(v => {
            return !uMap.get(v.userId)
          })
        })
      },
      handleSubmit(ms) {
        this.setCreateObject({
          group: {
            ...this.active.group,
            remark: ms.length ? `${ms.length}位成员` : '',
            members: ms
          }
        })
        this.routeBack()
      }
    }
  }
</script>
