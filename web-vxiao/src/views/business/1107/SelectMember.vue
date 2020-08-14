<template>
  <SelectUser v-if="users.length>0"
              title="相关成员"
              :cache="cache"
              :users="users"
              :multiselect="true"
              @submit="handleNext"></SelectUser>
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
        obj: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        const that = this
        if (that.obj.users) {
          that.cache = that.obj.users
          that.modifyCreateObjectField('users')
        }
        GroupApi.getGroupUsers(this.routeQuery('groupId')).then(res => {
          that.users = res.relations || []
        })
      },
      handleNext(ms) {
        if (!Check.isRealArray(ms)) {
          this.$message({ message: '请选择成员', type: 'warning' })
          return false
        }
        this.setCreateObject({ users: ms })
        this.routePush({
          name: 'sendMedal1107',
          query: {
            msgId: this.routeQuery('msgId'),
            groupId: this.routeQuery('groupId')
          }
        })
      }
    }
  }
</script>
